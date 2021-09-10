import { useState, useEffect } from 'react';
import CallPutTable from './CallPutTable';

export default function CallPutPrices (props: any) {

    const [callOptionPrices, setCallOptionPrices] = useState<number[][]>([]);
    const [callDeltas, setCallDeltas] = useState<number[][]>([]);
    const [putOptionPrices, setPutOptionPrices] = useState<number[][]>([]);
    const [putDeltas, setPutDeltas] = useState<number[][]>([]);
    const [dates, setDates] = useState<any[]>([]);
    const [prices, setPrices] = useState<any[]>([]);

    /* blackScholes(s, k, t, v, r, callPut)
        s - Current price of the underlying
        k - Strike price
        t - Time to expiration in years
        v - Volatility as a decimal
        r - Annual risk-free interest rate as a decimal
        callPut - The type of option to be priced - "call" or "put"
        N(d1) = delta, display it
    */

    const calculateOptionPrices = async () => {
        var bs = require("black-scholes");
        let arrCallOptionPrices:number[][] = []; let arrPutOptionPrices:number[][] = [];
        let callDeltas:number[][] = []; let putDeltas:number[][] = [];
        let pricesArr:any = [];
        for(let i=0; i<props.datesOfMarketYear.length; i++) {
            arrCallOptionPrices[i] = []; arrPutOptionPrices[i] = [];
            callDeltas[i] = []; putDeltas[i] = [];
            for(let j=0; j<props.strikePrices.length; j++) {
                let s = props.currentUnderlying;
                let k = props.strikePrices[j];
                let t = props.datesOfMarketYear[i];
                let v = props.volatility;
                let r = props.riskFreeInterestRate;
                let d1 = getD1(s, k, t, v, r);
                let d2 = getD2(d1, t, v);
                let delta = bs.stdNormCDF(d1);
                let callPrice = s * delta - k * Math.pow(Math.E, -1 * r * t) * bs.stdNormCDF(d2);
                let putPrice = k * Math.pow(Math.E, -1 * r * t) * bs.stdNormCDF(-d2) - s * bs.stdNormCDF(-d1);
                arrCallOptionPrices[i][j] = callPrice;
                arrPutOptionPrices[i][j] = putPrice;
                callDeltas[i][j] = delta;
                putDeltas[i][j] = Math.round(((delta-1) + Number.EPSILON) * 1000) / 1000;
            }
            pricesArr = mergePrices(props.strikePrices, arrCallOptionPrices[i], arrPutOptionPrices[i], callDeltas[i], putDeltas[i])
        }
        setCallOptionPrices(arrCallOptionPrices);
        setPutOptionPrices(arrPutOptionPrices);
        setCallDeltas(callDeltas);
        setPutDeltas(putDeltas);
        mergeDates()
    }

    function getD1(s: number, k: number, t: number, v: number, r: number) {
        return  (r * t + Math.pow(v, 2) * t / 2 - Math.log(k / s)) / (v * Math.sqrt(t));
    }

    function getD2(d1: number, t: number, v: number) {
        return d1 - v * Math.sqrt(t);
    }

    function mergeDates () {
        let datesArr:any = [];
        for(let i=0; i<props.datesOfMarketYear.length; i++) {
            let month = '';
            let m = JSON.stringify(props.dates[i]).substring(1).slice(5,7);
            if(m === '01') month = 'JAN';
            if(m === '02') month = 'FEB';
            if(m === '03') month = 'MAR';
            if(m === '04') month = 'APR';
            if(m === '05') month = 'MAY';
            if(m === '06') month = 'JUN';
            if(m === '07') month = 'JUL';
            if(m === '08') month = 'AUG';
            if(m === '09') month = 'SEP';
            if(m === '10') month = 'OCT';
            if(m === '11') month = 'NOV';
            if(m === '12') month = 'DEC';
    
            let str = JSON.stringify(props.dates[i]).substring(1).slice(8,10);
            str += ' ' + month + ' ';
            str += JSON.stringify(props.dates[i]).substring(1).slice(0,4);

            datesArr[i] = ({
                "_id": i,
                "date": props.dates[i],
                "dateFormat": str,
                "timeInMarketYears": props.datesOfMarketYear[i],
            });
        }
        setDates(datesArr);
    }

    function mergePrices (strikePrices: any, arrCallOptionPrices: any,
            arrPutOptionPrices: any, callDeltas: any, putDeltas: any) {

        let pricesArr:any = [];
        for(let i=0; i<strikePrices.length; i++) {
            pricesArr[i] = ({
                "strikePrice": strikePrices[i],
                "callPrice": arrCallOptionPrices[i],
                "callDelta": callDeltas[i],
                "putPrice": arrPutOptionPrices[i],
                "putDelta": putDeltas[i]
            })
        }
        setPrices(pricesArr);
        return pricesArr;
    }

    useEffect(() => {
        calculateOptionPrices();
    }, [props]);

    useEffect(() => {
        return function cleanup() { };
    }, []);
    
    const columns = [{
        accessor: 'dateFormat',
        style: { 'fontWeight': 'bold' }
    }];

    const subColumns = [{
        Header: 'Calls',
        columns: [{
                Header: 'Price',
                accessor: 'callPrice',
                width: 100,
                style: { 'whiteSpace': 'unset', 'textAlign': 'center' },
                Cell: (row: any) => {
                    let c = Math.round(((parseFloat(row.original.callPrice)) + Number.EPSILON) * 10000) / 10000;
                    return <span>{c}</span>
                }
            }, {
                Header: () => <span>&#916;</span>,
                accessor: 'callDelta',
                width: 100,
                style: { 'whiteSpace': 'unset', 'textAlign': 'center' },
                Cell: (row: any) => {
                    let cd = Math.round(((parseFloat(row.original.callDelta)) + Number.EPSILON) * 10000) / 10000;
                    return <span>{cd}</span>
                }
        }]}, {
        Header: 'Strikes',
        columns: [{
                accessor: 'strikePrice',
                style: { 'whiteSpace': 'unset', 'textAlign': 'center', 'fontWeight': 'bold' }
        }]}, {
        Header: 'Puts',
        columns: [{
                Header: 'Price',
                accessor: 'putPrice',
                width: 100,
                style: { 'whiteSpace': 'unset', 'textAlign': 'center' },
                Cell: (row: any) => {
                    let p = Math.round(((parseFloat(row.original.putPrice)) + Number.EPSILON) * 10000) / 10000;
                    return <span>{p}</span>
                }
            }, {
                Header: () => <span>&#916;</span>,
                accessor: 'putDelta',
                width: 100,
                style: { 'whiteSpace': 'unset', 'textAlign': 'center' },
                Cell: (row: any) => {
                    let pd = Math.round(((parseFloat(row.original.putDelta)) + Number.EPSILON) * 10000) / 10000;
                    return <span>{pd}</span>
                }
        }]
    }];

    return <CallPutTable columns={columns} subColumns={subColumns} data={dates} subData={prices} />
}