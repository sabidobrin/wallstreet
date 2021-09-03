import React, { useState, useEffect } from 'react';
import { log, sqrt, exp, pi } from 'mathjs';
import './black-scholes-model.css';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { Submit } from '../../context';
//import { apiResponseHandling } from '../../functions';

export default function BlackScholesModel (props: any) {

    const [apiResponse, setApiResponse] = useState({
        responseCode: 0,
        message: ""
    });

    const [currentUnderlyingPrice, setCurrentUnderlyingPrice] = useState(0);
    const [strikePrice, setStrikePrice] = useState(0);
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
        let d1 = (log(currentUnderlyingPrice / strikePrice) + (riskFreeInterestRate + volatility * volatility / 2) * timeToMaturity) / (volatility * sqrt(timeToMaturity));
        //let d2 = d1 - volatility * sqrt(timeToMaturity);
        setDelta(parseFloat(normDist(d1).toFixed(3)));
    }

    function normDist (d: number) : number {
        return (1.0/(sqrt(2*pi))) * exp(-0.5*d);
    }
   
    const calculateOptionPrice = async () => {        
        var bs = require("black-scholes");
        let optionPrice = bs.blackScholes(currentUnderlyingPrice, strikePrice, timeToMaturity, volatility, riskFreeInterestRate, flag).toFixed(2);
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
            <Row>
                <div id="title">Black Scholes Model</div>
            </Row>            
            <Row>
                <Col xs={12} sm={12} md={7} lg={7}><Card>
                <Form id="black-scholes" onSubmit={handleSubmit}>
                <Row>
                    <Row><div style={{ paddingBottom: '0.5pc' }}><b>Calculator</b></div></Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Form.Group className="mb-3" controlId="black-scholes-L">
                            <Form.Label>Ticker</Form.Label>
                            <Form.Control type="text" placeholder="Ticker"
                                onBlur={(e:any) => tickerCheck(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Current underlying price</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="Current underlying price"
                                onBlur={(e:any) => setCurrentUnderlyingPrice(parseFloat(e.target.value))} />
                            <InputGroup.Text>USD</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Strike price</Form.Label>
                            {/*<Row>
                            <Col id="double" xs={12} sm={12} md={6} lg={6}>*/}
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="From"
                                onBlur={(e:any) => setStrikePrice(parseFloat(e.target.value))} />
                            <InputGroup.Text>USD</InputGroup.Text>
                            </InputGroup>
                            {/*</Col>
                            <Col id="double" xs={12} sm={12} md={6} lg={6}>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.01" min="0" placeholder="To"
                                onBlur={(e:any) => setStrikePrice(parseFloat(e.target.value))} />
                            <InputGroup.Text>USD</InputGroup.Text>
                            </InputGroup>
                            </Col>
                            </Row>*/}
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Form.Group className="mb-3" controlId="black-scholes-L">
                            <Form.Label>Flag</Form.Label>
                            <Form.Control type="text" placeholder="C/P"
                                onBlur={(e:any) => flagCheck(e.target.value.toLowerCase())} />
                        </Form.Group>                        
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Volatility</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" placeholder="Volatility" step="1"
                                onBlur={(e:any) => setVolatility(parseFloat(e.target.value)/100)} />
                            <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="black-scholes-L">
                            <Form.Label>Expiration dates</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="date" placeholder="To"
                                onBlur={(e:any) => setTimeToMaturity(parseFloat(e.target.value)/marketDays)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row id="button-row"><Submit /></Row>
                </Form></Card>
                </Col>
                
                <Col xs={12} sm={12} md={5} lg={5}><Card>
                <Row><div style={{ paddingBottom: '0.5pc' }}><b>Results</b></div></Row>
                <Row><div>Ticker: <b>{ticker}</b></div></Row>
                <Row>
                    <div>{flag === '' ? 'Call/Put' : flag.charAt(0).toUpperCase() + flag.slice(1)} option price: <b>{flag === 'call' ? callOptionPrice : putOptionPrice}</b> USD</div>
                </Row>
                <Row><div>{flag === '' ? 'Call/Put': flag.charAt(0).toUpperCase() + flag.slice(1)} delta: <b>{flag === 'call' ? delta : delta-1}</b></div></Row>
                <Row></Row>
                </Card></Col>
            </Row>
        </Container>
    );
}

/* [19:23, 31/08/2021] Andrej Poljanec: Sej loh googleas black scholes.
Mislm da je time to expiration, current price, strike price, interest rate, volatility.
[19:23, 31/08/2021] Andrej Poljanec: Pa npr interest rate nc ne vemo kaj se dogaja s tem in bi blo fajn iz nekje potegnt.
To nima bit kej za vnasat. More bit povezan z apijem*/