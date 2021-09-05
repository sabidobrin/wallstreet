import React, { useState, useEffect } from 'react';
import { log, sqrt, exp, pi, string, typeOf } from 'mathjs';
import './black-scholes-model.css';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Submit } from '../../context';
import { CloseOutlined } from '@material-ui/icons';
//import { apiResponseHandling } from '../../functions';

export default function BlackScholesModel (props: any) {

    const [apiResponse, setApiResponse] = useState({
        responseCode: 0,
        message: ""
    });

    const [currentUnderlyingPrice, setCurrentUnderlyingPrice] = useState(0);

    const [strikePriceFrom, setStrikePriceFrom] = useState(0);
    const [strikePriceTo, setStrikePriceTo] = useState(0);
    const [strikePriceStep, setStrikePriceStep] = useState(0);
    const [strikePricesArray, setStrikePricesArray] = useState<number[]>([]);

    const [volatility, setVolatility] = useState(0);
    const [timeToMaturity, setTimeToMaturity] = useState(0);
    const [ticker, setTicker] = useState('');
    const [flag, setFlag] = useState('');

    const [marketDays, setMarketDays] = useState(0); // za interest rates je druga cifra, po treba fetchat glede na ticker
    const fetchMarketDaysInYear = async (ticker: string) => setMarketDays(252);

    const [riskFreeInterestRate, setRiskFreeInterestRate] = useState(0);
    const fetchRiskFreeInterestRate = async () => setRiskFreeInterestRate(0.09);

    const [delta, setDelta] = useState(0);
    const [callOptionPrice, setCallOptionPrice] = useState(0);
    const [putOptionPrice, setPutOptionPrice] = useState(0);

    /* blackScholes(s, k, t, v, r, callPut)
        s - Current price of the underlying
        k - Strike price
        t - Time to expiration in years
        v - Volatility as a decimal
        r - Annual risk-free interest rate as a decimal
        callPut - The type of option to be priced - "call" or "put"
        N(d1) = delta, display it
    */

    const calculateDelta = () => {
        let d1:number = (log(currentUnderlyingPrice / strikePriceFrom) + (riskFreeInterestRate + volatility * volatility / 2) * timeToMaturity) / (volatility * sqrt(timeToMaturity));
        //let d2 = d1 - volatility * sqrt(timeToMaturity);
        setDelta(parseFloat(normDist(d1).toFixed(3)));
    }

    function normDist (d: number) : number {
        return (1.0/(sqrt(2*pi))) * exp(-0.5*d);
    }
   
    const calculateOptionPrice = async () => {        
        var bs = require("black-scholes");
        let optionPrice = bs.blackScholes(currentUnderlyingPrice, strikePriceFrom, timeToMaturity, volatility, riskFreeInterestRate, flag).toFixed(2);
        if (flag === "call") setCallOptionPrice(optionPrice);
        if (flag === "put") setPutOptionPrice(optionPrice);
    }
    
    const tickerCheck = async (value: string) => {
        if(value !== "") setTicker(value.toUpperCase());
    }

    const flagCheck = async (value: string) => {
        if(value === "c" || value === "call") setFlag("call");
        if(value === "p" || value === "put") setFlag("put");
    }

    const makeStrikePricesArray = (step: number) => {
        setStrikePriceStep(step);
        if(strikePriceFrom !== 0 && strikePriceTo !== 0) {
            let arr = [];
            let element = strikePriceFrom;
            while (element <= strikePriceTo) {
                element = Math.round((element + Number.EPSILON) * 100) / 100;
                arr.push(element);
                element += step;
            }
            console.log(arr)
            setStrikePricesArray(arr);
        }        
    }

    const [dateList, setDateList] = useState<string[]>([]);
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
        let html = <div id={`date-${index}`} className="dates">{date.slice(8,10)}/{date.slice(5,7)}/{date.slice(0,4)} <CloseOutlined id="icon-delete" onClick={()=> deleteDateFromList(index)} /></div>;
        return html;
    }

    useEffect(() => {
        fetchMarketDaysInYear(ticker);
        fetchRiskFreeInterestRate();
        return function cleanup() { };
    }, []);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        calculateOptionPrice();
        calculateDelta();
    }

    return (
        <Container fluid>
            <Row><div id="title">Black Scholes Model</div></Row>            
            <Row>
                <Col xs={12} sm={12} md={7} lg={7}><Card>
                <Form id="black-scholes" onSubmit={handleSubmit}>
                <Row>
                    <Row><div style={{ paddingBottom: '0.5pc' }}><b>Calculator</b></div></Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
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
                            <Form.Control type="number" placeholder="Volatility" step="1"
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
                                onBlur={(e:any) => setStrikePriceFrom(parseFloat(e.target.value))} />
                            <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup>
                            </Col>
                            <Col id="triple" xs={12} sm={12} md={4} lg={4}>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="To"
                                onBlur={(e:any) => setStrikePriceTo(parseFloat(e.target.value))} />
                            <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup>
                            </Col>
                            <Col id="triple" xs={12} sm={12} md={4} lg={4}>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="Step" id="black-scholes-L"
                                onBlur={(e:any) => makeStrikePricesArray(parseFloat(e.target.value))} />
                            </InputGroup>
                            </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} style={{ borderLeft: '1px solid rgba(0,0,0,.125)'}}>
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
                
                <Col xs={12} sm={12} md={5} lg={5}><Card>
                <Row><div style={{ paddingBottom: '0.5pc' }}><b>Results</b></div></Row>
                <Row><div>Ticker: <b>{ticker}</b></div></Row>
                <Row><div>{flag === '' ? 'Call/Put' : flag.charAt(0).toUpperCase() + flag.slice(1)} option price: <b>{flag === 'call' ? callOptionPrice : putOptionPrice}</b> $</div></Row>
                <Row><div>{flag === '' ? 'Call/Put': flag.charAt(0).toUpperCase() + flag.slice(1)} delta: <b>{flag === 'call' ? delta : flag === 'put' ? delta-1 : 0}</b></div></Row>
                </Card></Col>
            </Row>
        </Container>
    );
}