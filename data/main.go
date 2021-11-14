package main

// daily reports
// https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/11-13-2021.csv

// time series
// CASES (confirmed)
// https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
// DEATHS (global)
// https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv
// RECOVERED (global)
// https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"
)

type Country struct {
	Name       string `json:"name"`
	Population int    `json:"population"`
}

// https://data.worldbank.org/indicator/SP.POP.TOTL?locations=EU
var countries = []Country{
	{Name: "Greece", Population: 10_715_549},
	{Name: "Germany", Population: 83_240_525},
	{Name: "France", Population: 67_391_582},
	{Name: "United Kingdom", Population: 67_200_000},
}

type CountryRegistry map[string]bool

func NewCountryRegistry(countries []Country) CountryRegistry {
	r := CountryRegistry{}
	for _, c := range countries {
		r[c.Name] = true
	}
	return r
}

func (r CountryRegistry) Includes(country string) bool {
	_, ok := r[country]
	return ok
}

type TimeSeries struct {
	Label string       `json:"label"`
	Data  []*TimePoint `json:"data"`
}

type TimePoint struct {
	Date  time.Time `json:"x"`
	Value int       `json:"y"`
}

func fetchCSV(client *http.Client, uri string) ([][]string, error) {
	resp, err := http.Get(uri)
	if err != nil {
		return [][]string{}, fmt.Errorf("[error] %v", err)
	}
	defer resp.Body.Close()
	r := csv.NewReader(resp.Body)

	records := [][]string{}

	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return records, err
		}
		records = append(records, record)
	}

	return records, nil
}

func processTimeSeries(records [][]string, countries CountryRegistry) ([]TimeSeries, error) {
	// the first line contains dates
	// Province/State,Country/Region,Lat,Long,1/22/20,1/23/20,1/24/20,...
	// get the starting date
	d1, err := time.Parse("1/2/06", records[0][4])
	if err != nil {
		return nil, fmt.Errorf("failed to parse %s: %v", d1, err)
	}

	results := map[string][]*TimePoint{}
	var newCountry bool
	for _, record := range records[1:] {

		country := record[1]
		if !countries.Includes(country) {
			continue
		}
		if _, ok := results[country]; !ok {
			newCountry = true
			results[country] = []*TimePoint{}
		} else {
			newCountry = false
		}
		for i, val := range record[4:] {
			v, err := strconv.Atoi(val)
			if err != nil {
				return nil, fmt.Errorf("failed to parse %s to int: %v", val, err)
			}
			tp := &TimePoint{
				Date:  d1.Add(time.Duration(i * 24 * int(time.Hour))),
				Value: v,
			}
			if newCountry {
				results[country] = append(results[country], tp)
			} else {
				results[country][i].Value += tp.Value
			}
		}
	}

	// process and return results
	series := []TimeSeries{}
	for country, ts := range results {
		series = append(series, TimeSeries{Label: country, Data: ts})
	}
	return series, nil
}

func main() {
	client := &http.Client{}
	uri := "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
	records, _ := fetchCSV(client, uri)
	cr := NewCountryRegistry(countries)
	results, err := processTimeSeries(records, cr)
	if err != nil {
		log.Fatal(err)
	}
	body, err := json.Marshal(results)
	if err != nil {
		log.Fatal(err)
	}
	ioutil.WriteFile("results.json", body, fs.ModePerm)
	body, err = json.Marshal(countries)
	if err != nil {
		log.Fatal(err)
	}
	ioutil.WriteFile("countries.json", body, fs.ModePerm)
}
