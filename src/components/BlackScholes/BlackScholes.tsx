import React, { useState, useEffect } from 'react';
import './black-scholes.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Submit } from '../../context';

/*export interface Iparameters {
    currentUnderlyingPrice: number;
    strikePrice: number;
    riskFreeInterestRate: number;
    timeToMaturity: number;
    normalDistribution: number;
}*/

export default function BlackScholes (props: any) {

    /*const [parameters, setParameters] = useState({
        currentUnderlyingPrice: undefined,
        strikePrice: undefined,
        riskFreeInterestRate: 0,
        timeToMaturity: undefined,
        normalDistribution: undefined
    });*/

    const [currentUnderlyingPrice, setCurrentUnderlyingPrice] = useState(0);
    const [strikePrice, setStrikePrice] = useState(0);
    const [timeToMaturity, setTimeToMaturity] = useState(0);

    const [riskFreeInterestRate, setRiskFreeInterestRate] = useState(0);
    const [normalDistribution, setNormalDistribution] = useState(0);
    const [callOptionPrice, setCallOptionPrice] = useState(0);

    const handleSubmit = (event: any) => {
        let price:number = 0;
        setCallOptionPrice(price);
    }

    return (
        <Container fluid>
            <div id="title">Black Scholes Model Calculator</div>
            <Col xs={12} sm={12} md={6} lg={6}>
            <Form id="black-scholes">
            <Row>
                <Col xs={12} sm={12} md={6} lg={6}>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Current underlying price</Form.Label>
                    <Form.Control type="text" placeholder="Current underlying price" value={currentUnderlyingPrice} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Strike price</Form.Label>
                    <Form.Control type="text" placeholder="Strike price" value={strikePrice} />
                </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Time to maturity</Form.Label>
                    <Form.Control type="text" placeholder="Time to maturity" value={timeToMaturity} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Risk-free interest rate</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={riskFreeInterestRate} value={riskFreeInterestRate} />
                </Form.Group>
                </Col>
            </Row>
            <Row><Submit handleSubmit={handleSubmit} /></Row>
            <Row><b>Call option price: {callOptionPrice}</b></Row>
            </Form>
            </Col>
            
        </Container>
    );
}

/* [19:23, 31/08/2021] Andrej Poljanec: Sej loh googleas black scholes.
Mislm da je time to expiration, current price, strike price, interest rate, volatility.
[19:23, 31/08/2021] Andrej Poljanec: Pa npr interest rate nc ne vemo kaj se dogaja s tem in bi blo fajn iz nekje potegnt.
To nima bit kej za vnasat. More bit povezan z apijem*/