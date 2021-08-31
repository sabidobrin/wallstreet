import React, { useState, useEffect } from 'react';
import './black-scholes.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Submit } from '../../context';

export interface parameters {
    callOptionPrice: number;
    currentUnderlyingPrice: number;
    strikePrice: number;
    riskFreeInterestRate: number;
    timeToMaturity: number;
    normalDistribution: number;
}

export default function BlackScholes (props: any) {

    const [parameters, setParameters] = useState({
        callOptionPrice: undefined,
        currentUnderlyingPrice: undefined,
        strikePrice: undefined,
        riskFreeInterestRate: 0,
        timeToMaturity: undefined,
        normalDistribution: undefined
    });

    const handleSubmit = () => {
        console.log("clicked");
    }

    return (
        <Container fluid>
            <div id="title">Black Scholes Model Calculator</div>
            <Col xs={12} sm={12} md={6} lg={6}>
            <Form id="black-scholes">
            <Row>
                <Col xs={12} sm={12} md={6} lg={6}>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Call option price</Form.Label>
                    <Form.Control type="text" placeholder="Call option price" value={parameters.callOptionPrice} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Current underlying price</Form.Label>
                    <Form.Control type="text" placeholder="Current underlying price" value={parameters.currentUnderlyingPrice} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Strike price</Form.Label>
                    <Form.Control type="text" placeholder="Strike price" value={parameters.strikePrice} />
                </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Risk-free interest rate</Form.Label>
                    <Form.Control plaintext readOnly defaultValue="0" value={parameters.riskFreeInterestRate} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Time to maturity</Form.Label>
                    <Form.Control type="text" placeholder="Time to maturity" value={parameters.timeToMaturity} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="black-scholes">
                    <Form.Label>Normal distribution</Form.Label>
                    <Form.Control type="text" placeholder="Normal distribution" value={parameters.normalDistribution} />
                </Form.Group>
                </Col>
            </Row>
            
            <Row><Submit handleSubmit={handleSubmit} /></Row>
            </Form>
            </Col>
            
        </Container>
    );
}

/* [19:23, 31/08/2021] Andrej Poljanec: Sej loh googleas black scholes.
Mislm da je time to expiration, current price, strike price, interest rate, volatility.
[19:23, 31/08/2021] Andrej Poljanec: Pa npr interest rate nc ne vemo kaj se dogaja s tem in bi blo fajn iz nekje potegnt.
To nima bit kej za vnasat. More bit povezan z apijem*/