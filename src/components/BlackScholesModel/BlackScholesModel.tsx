import React, { useState, useEffect } from 'react';
import { log, sqrt, exp, pi, string, typeOf, number } from 'mathjs';
import './black-scholes-model.css';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { CallPutPrices, Submit } from '../../context';
import { CloseOutlined } from '@material-ui/icons';
//import { apiResponseHandling } from '../../functions';

export default function BlackScholesModel (props: any) {

    const [apiResponse, setApiResponse] = useState({ responseCode: 0, message: "" });

    const [currentUnderlyingPrice, setCurrentUnderlyingPrice] = useState(0);

    const [strikePriceFrom, setStrikePriceFrom] = useState(0);
    const [strikePriceTo, setStrikePriceTo] = useState(0);
    const [strikePriceStep, setStrikePriceStep] = useState(0);
    const [strikePricesArray, setStrikePricesArray] = useState<number[]>([]);

    const [volatility, setVolatility] = useState(0);
    const [ticker, setTicker] = useState('');
    const [flag, setFlag] = useState('');
    const [timeToMaturity, setTimeToMaturity] = useState(0);

    const [marketDays, setMarketDays] = useState(0)
    const fetchMarketDaysInYear = async (ticker: string) => setMarketDays(365);

    const [dateList, setDateList] = useState<string[]>([]);
    const [dateListDates, setDateListDates] = useState<Date[]>([]);
    const [datesOfMarketYear, setDatesOfDatesMarketYear] = useState<number[]>([]);

    const [riskFreeInterestRate, setRiskFreeInterestRate] = useState(0);
    const fetchRiskFreeInterestRate = async () => setRiskFreeInterestRate(0.0009);
    
    const tickerCheck = async (value: string) => {
        if(value !== "") setTicker(value.toUpperCase());
    }

    const flagCheck = async (value: string) => {
        if(value === "c" || value === "call") setFlag("call");
        if(value === "p" || value === "put") setFlag("put");
    }

    const makeStrikePricesArray = (step: number) => {
        if(strikePriceFrom !== 0 && strikePriceTo !== 0) {
            let arr = [];
            if(strikePriceFrom === strikePriceTo) {
                setStrikePriceStep(0);
                arr.push(strikePriceFrom);
            }
            else {
                setStrikePriceStep(step);
                let element = strikePriceFrom;
                while (element <= strikePriceTo) {
                    element = Math.round((element + Number.EPSILON) * 100) / 100;
                    arr.push(element);
                    element += step;
                }
            }
            setStrikePricesArray(arr);
        }
    }

    const updateStrikePriceFrom = (price: number) => {
        setStrikePriceFrom(price);
        let arr = [];
        if(strikePriceTo === price) {
            setStrikePriceStep(0);
                arr.push(price);
        }
        else if (strikePriceTo !== 0 && strikePriceStep !== 0) {
            let element = price;
                while (element <= strikePriceTo) {
                    element = Math.round((element + Number.EPSILON) * 100) / 100;
                    arr.push(element);
                    element += strikePriceStep;
                }
        }
        setStrikePricesArray(arr);
    }

    const updateStrikePriceTo = (price: number) => {
        setStrikePriceTo(price);
        let arr = [];
        if(strikePriceFrom === price) {
            setStrikePriceStep(0);
                arr.push(strikePriceFrom);
        }
        else if (strikePriceFrom !== 0 && strikePriceStep !== 0) {
            let element = strikePriceFrom;
                while (element <= price) {
                    element = Math.round((element + Number.EPSILON) * 100) / 100;
                    arr.push(element);
                    element += strikePriceStep;
                }
        }
        setStrikePricesArray(arr);
    }

    const addDateToList = (value: string) => {
        let isInList:boolean = false;
        for(let i=0; i<dateList.length; i++) {
            if(dateList[i].localeCompare(value) === 0) isInList = true;
        }
        if(!isInList) setDateList([...dateList, value]);
    }
    const deleteDateFromList = (index: number) => {
        const tmp = [...dateList];
        tmp.splice(index, 1);
        setDateList(tmp);
    }
    const formatDates = (date: string, index: number) => {
        return <div id={`date-${index}`} className="dates">{date.slice(8,10)}/{date.slice(5,7)}/{date.slice(0,4)} <CloseOutlined id="icon-delete" onClick={()=> deleteDateFromList(index)} /></div>;
    }

    const makeDatesOfMarketYearArray = async () => {
        let arrYear = []; let arrDates = [];
        let today = new Date();
        for(let i=0; i<dateList.length; i++) {
            let dateCompared = new Date(dateList[i]);
            arrDates.push(dateCompared);
            let diffMils = dateCompared.getTime() - today.getTime();
            let diffDays = Math.ceil(diffMils / (1000 * 3600 * 24)) / marketDays;
            diffDays = Math.round((diffDays + Number.EPSILON) * 1000) / 1000;
            arrYear.push(diffDays);
        }
        arrYear.sort(function(a, b) { return a-b });
        setDatesOfDatesMarketYear(arrYear);
        arrDates.sort(function(a, b) { return a.getTime()-b.getTime() });
        setDateListDates(arrDates);
    }

    const mapDates = () => {
        return <CallPutPrices title={ticker} currentUnderlying={currentUnderlyingPrice} volatility={volatility} dates={dateListDates}
            riskFreeInterestRate={riskFreeInterestRate} datesOfMarketYear={datesOfMarketYear} strikePrices={strikePricesArray}
        />;
    }

    useEffect(() => {
        fetchMarketDaysInYear(ticker);
        fetchRiskFreeInterestRate();
        return function cleanup() { };
    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        makeDatesOfMarketYearArray();
    }

    return (
        <Container fluid>
            <Row><div id="title">Black Scholes Model</div></Row>            
            <Row>
                <Col xs={12} sm={12} md={6} lg={6}><Card>
                <Form id="black-scholes" onSubmit={handleSubmit}>
                <Row>
                    <Row><div style={{ paddingBottom: '0.5pc' }}><b>Calculator</b></div></Row>
                    <Col xs={12} sm={12} md={8} lg={8}>
                        <Row>
                        <Col id="triple" xs={12} sm={12} md={8} lg={8}>
                        <Form.Group className="mb-3" controlId="black-scholes-L">
                            <Form.Label>Ticker</Form.Label>
                            <Form.Control type="text" placeholder="Ticker"
                                onBlur={(e:any) => tickerCheck(e.target.value)} />
                        </Form.Group>
                        </Col>
                        <Col id="triple" xs={12} sm={12} md={4} lg={4}>
                        <Form.Group className="mb-3" controlId="black-scholes-L">
                            <Form.Label>Flag</Form.Label>
                            <Form.Control type="text" placeholder="C/P"
                                onBlur={(e:any) => flagCheck(e.target.value.toLowerCase())} />
                        </Form.Group>   
                        </Col>
                        </Row>
                        <Row>
                        <Col id="triple" xs={12} sm={12} md={6} lg={6}>
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Current underlying</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="Price"
                                onBlur={(e:any) => setCurrentUnderlyingPrice(parseFloat(e.target.value))} />
                            <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        </Col>
                        <Col id="triple" xs={12} sm={12} md={6} lg={6}>
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Volatility</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" placeholder="Volatility" step="0.01"
                                onBlur={(e:any) => setVolatility(parseFloat(e.target.value)/100)} />
                            <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        </Col>
                        </Row>
                        
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Strike price</Form.Label>
                            <Row>
                            <Col id="triple" xs={12} sm={12} md={4} lg={4}>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="From"
                                onBlur={(e:any) => updateStrikePriceFrom(parseFloat(e.target.value))} />
                            <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup>
                            </Col>
                            <Col id="triple" xs={12} sm={12} md={4} lg={4}>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="To"
                                onBlur={(e:any) => updateStrikePriceTo(parseFloat(e.target.value))} />
                            <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup>
                            </Col>
                            <Col id="triple" xs={12} sm={12} md={4} lg={4}>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="Step" id="black-scholes-L"
                                onBlur={(e:any) => e.target.value === "0" ? e.preventDefault() : makeStrikePricesArray(parseFloat(e.target.value))} />
                            </InputGroup>
                            </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4} style={{ borderLeft: '1px solid rgba(0,0,0,.125)'}}>
                        <Form.Group className="mb-3" controlId="black-scholes-L">
                            <Form.Label>Expiration dates</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="date" placeholder="To" min={new Date().toISOString().slice(0,10)}
                                onChange={(e:any) => addDateToList(e.target.value)} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="black-scholes-L">
                            {dateList.map((date, index) => formatDates(date, index))}
                        </Form.Group>
                    </Col>
                </Row>
                <Row id="button-row"><Submit /></Row>
                </Form></Card>
                </Col>
                
                <Col xs={12} sm={12} md={6} lg={6}><Card>
                <Row><div style={{ paddingBottom: '0.5pc' }}><b>{ticker === '' ? "Results" : "Results: " + ticker}</b></div></Row>
                <Row>{mapDates()}</Row>
                </Card></Col>
            </Row>
        </Container>
    );
}