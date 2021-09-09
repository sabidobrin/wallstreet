import { useState, useEffect } from 'react';
import TableElement from '../TableElement';

export default function CallPutPrices (props: any) {

    const [callOptionPrices, setCallOptionPrices] = useState<number[][]>([]);
    const [callDeltas, setCallDeltas] = useState<number[][]>([]);
    const [putOptionPrices, setPutOptionPrices] = useState<number[][]>([]);
    const [putDeltas, setPutDeltas] = useState<number[][]>([]);
    const [tableData, setTableData] = useState<any[]>([]);

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
        }
        setCallOptionPrices(arrCallOptionPrices);
        setPutOptionPrices(arrPutOptionPrices);
        setCallDeltas(callDeltas);
        setPutDeltas(putDeltas);
        return merge(props.dates, props.datesOfMarketYear, props.strikePrices,
            arrCallOptionPrices, arrPutOptionPrices, callDeltas, putDeltas);
    }

    function getD1(s: number, k: number, t: number, v: number, r: number) {
        return  (r * t + Math.pow(v, 2) * t / 2 - Math.log(k / s)) / (v * Math.sqrt(t));
    }

    function getD2(d1: number, t: number, v: number) {
        return d1 - v * Math.sqrt(t);
    }

    async function merge (dates: any, datesOfMarketYear: any, strikePrices: any,
        arrCallOptionPrices: any, arrPutOptionPrices: any, callDeltas: any, putDeltas: any) {
        let arr:any = [];
        for(let i=0; i<props.dates.length; i++) {
            arr[i] = ({ ...arr[i],
                "_id": i,
                "date": dates[i],
                "timeInMarketYears": datesOfMarketYear[i],
                "strikePrices": strikePrices,
                "callPrices": arrCallOptionPrices[i],
                "callDeltas": callDeltas[i],
                "putPrices": arrPutOptionPrices[i],
                "putDeltas": putDeltas[i]
            });
        }
        console.log(arr);
        setTableData(arr);
    }

    useEffect(() => {
        calculateOptionPrices();
    }, [props.dates]);

    useEffect(() => {
        return function cleanup() { };
    }, []);
    
    const columns = [{
        Header: 'Strike prices',
        accessor: 'strikePrices'
    }, {
        Header: 'Call Prices',
        accessor: 'callPrices'
    }, {
        Header: 'Call Deltas',
        accessor: 'callDeltas'
    }, {
        Header: 'Put Prices',
        accessor: 'putPrices'
    }, {
        Header: 'Put deltas',
        accessor: 'putDeltas'
    }];

    return <TableElement columns={columns} data={tableData} />
}