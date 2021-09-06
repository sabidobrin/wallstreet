import { useState, useEffect } from 'react';
import { log, sqrt, exp, pi, string, typeOf, number } from 'mathjs';
import TableElement from '../TableElement';
import '../tables.css';

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

    function normDist (d: number) : number { return (1.0/(sqrt(2*pi))) * exp(-0.5*d); }
    const calculateDeltas = async () => {
        let callDeltas:number[][] = []; let putDeltas:number[][] = [];
        for(let i=0; i<props.datesOfMarketYear.length; i++) {
            callDeltas[i] = []; putDeltas[i] = [];
            for(let j=0; j<props.strikePrices.length; j++) {
                let d1:any = (log(props.currentUnderlying / props.strikePrices[j]) + (props.riskFreeInterestRate + props.volatility * props.volatility / 2) * props.datesOfMarketYear[i]) / (props.volatility * sqrt(props.datesOfMarketYear[i]));
                d1 = Math.round((normDist(d1) + Number.EPSILON) * 1000) / 1000;
                callDeltas[i][j] = d1;
                putDeltas[i][j] = Math.round(((d1-1) + Number.EPSILON) * 1000) / 1000;
            }
        }
        setCallDeltas(callDeltas);
        setPutDeltas(putDeltas);
        //let d2 = d1 - volatility * sqrt(timeToMaturity);
    }    

    const calculateOptionPrices = async () => {
        var bs = require("black-scholes");
        let arrCallOptionPrices:number[][] = []; let arrPutOptionPrices:number[][] = [];
        for(let i=0; i<props.datesOfMarketYear.length; i++) {
            arrCallOptionPrices[i] = []; arrPutOptionPrices[i] = [];
            for(let j=0; j<props.strikePrices.length; j++) {
                let callOptionPrice:number = bs.blackScholes(props.currentUnderlying, props.strikePrices[j], props.datesOfMarketYear[i], props.volatility, props.riskFreeInterestRate, 'call').toFixed(3);
                let putOptionPrice:number = bs.blackScholes(props.currentUnderlying, props.strikePrices[j], props.datesOfMarketYear[i], props.volatility, props.riskFreeInterestRate, 'put').toFixed(3);
                arrCallOptionPrices[i][j] = callOptionPrice;
                arrPutOptionPrices[i][j] = putOptionPrice;
            }
        }
        setCallOptionPrices(arrCallOptionPrices);
        setPutOptionPrices(arrPutOptionPrices);
    }

    async function merge () {
        let arr:any = [];
        for(let i=0; i<props.dates.length; i++) {
            arr[i] = ({ ...arr[i],
                "_id": i,
                "date": props.dates[i],
                "timeInMarketYears": props.datesOfMarketYear[i],
                "strikePrices": props.strikePrices,
                "callPrices": callOptionPrices[i],
                "callDeltas": callDeltas[i],
                "putPrices": putOptionPrices[i],
                "putDeltas": putDeltas[i]
            });
        }
        console.log(arr);
        setTableData(arr);
    }

    const columns = [{ }];

    useEffect(() => {
        calculateOptionPrices();
        calculateDeltas();
        merge();
    }, [props.dates]);

    useEffect(() => {
        return function cleanup() { };
    }, []);

    return (
        <TableElement
            columns={columns}
            data={props.data}
            title={props.title}
        />);
}