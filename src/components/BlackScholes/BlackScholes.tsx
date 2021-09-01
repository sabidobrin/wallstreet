import React, { useState, useEffect } from 'react';
import NormalDistribution from 'normal-distribution';
import { e, log, sqrt } from 'mathjs';
import './black-scholes.css';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { Submit } from '../../context';
import { apiResponseHandling } from '../../functions';

export default function BlackScholes (props: any) {

    const [apiResponse, setApiResponse] = useState({
        responseCode: 0,
        message: ""
    });
    const [currentUnderlyingPrice, setCurrentUnderlyingPrice] = useState(0);
    const [strikePrice, setStrikePrice] = useState(0);
    const [timeToMaturityDays, setTimeToMaturityDays] = useState(0);
    const [ticker, setTicker] = useState('');

    const [marketDays, setMarketDays] = useState(252); // za interest rates je druga cifra, po treba fetchat glede na ticker
    const [riskFreeInterestRate, setRiskFreeInterestRate] = useState(0);
    const [normalDistribution, setNormalDistribution] = useState(0);
    const [callOptionPrice, setCallOptionPrice] = useState(0);

    const fetchMarketDaysInYear = async (ticker: string) => {
        const url = process.env.REACT_APP_API_BASE_URL_TREASURY + '/v2/accounting/od/avg_interest_rates';
        const response = await fetch(url, { method: 'get' });
        setApiResponse(apiResponseHandling(response));
        if(!response.ok) { /* error handling */ }
        else {
            const json = await response.json();
            const data = json.data;
            const meta = json.meta;
        }
    }

    const fetchRiskFreeInterestRate = async () => {
        const url = process.env.REACT_APP_API_BASE_URL_TREASURY + '/v2/accounting/od/avg_interest_rates';
        const response = await fetch(url, { method: 'get' });
        setApiResponse(apiResponseHandling(response));
        if(!response.ok) { /* error handling */ }
        else {
            const json = await response.json();
            const data = json.data;
            const meta = json.meta;
        }
    }

    const calculateTimeToMaturity = () => { return timeToMaturityDays / marketDays; }

    /*
    C = S(t) * N(d1) - K * e(^-rt) * N(d2), where
    d1 = (ln(S(t)/K) + (r + (o^2(v)/2)) * t) / (o(s) * sqrt(t))
    d2 = d1 - o(s) * sqrt(t)
    */
    const calculate = () => {
        let time:number = calculateTimeToMaturity();
        let timesq:number = sqrt(time);

        const normDist = new NormalDistribution(0, 1);
        let cop:number = 0;
        return cop;
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        let price:number = calculate();
        setCallOptionPrice(price);
    }

    useEffect(() => {
        fetchMarketDaysInYear(ticker);
        fetchRiskFreeInterestRate();
        return function cleanup() { };
    }, []);

    const tickerCheck = async (value: string) => {
        if(value !== "") setTicker(value.toUpperCase());
    }

    return (
        <Container fluid>
            <Row>
                <div id="title">Black Scholes Model</div>
            </Row>            
            <Row>
                <Col xs={12} sm={12} md={6} lg={6}><Card>
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
                            <Form.Label>Time to maturity</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" placeholder="Time to maturity" min={0}
                                onChange={e => setTimeToMaturityDays(parseFloat(e.target.value))} />
                            <InputGroup.Text>days</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Current underlying price</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.0001" min="0" placeholder="Current underlying price"
                                onChange={e => setCurrentUnderlyingPrice(parseFloat(e.target.value))} />
                            <InputGroup.Text>USD</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="black-scholes">
                            <Form.Label>Strike price</Form.Label>
                            <InputGroup className="mb-2">
                            <Form.Control type="number" step="0.0001" min="0" placeholder="Strike price"
                                onChange={e => setStrikePrice(parseFloat(e.target.value))} />
                            <InputGroup.Text>USD</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>                
                    </Col>
                </Row>
                <Row id="button-row"><Submit /></Row>
                </Form></Card>
                </Col>
                
                <Col xs={12} sm={12} md={6} lg={6}><Card>
                <Row><div style={{ paddingBottom: '0.5pc' }}><b>Results</b></div></Row>
                <Row>
                    <div>Ticker: <b>{ticker}</b></div>
                </Row>
                <Row>
                    <div>Call option price: <b>{callOptionPrice}</b> USD</div>
                </Row>
                </Card></Col>
            </Row>
        </Container>
    );
}

/* [19:23, 31/08/2021] Andrej Poljanec: Sej loh googleas black scholes.
Mislm da je time to expiration, current price, strike price, interest rate, volatility.
[19:23, 31/08/2021] Andrej Poljanec: Pa npr interest rate nc ne vemo kaj se dogaja s tem in bi blo fajn iz nekje potegnt.
To nima bit kej za vnasat. More bit povezan z apijem*/