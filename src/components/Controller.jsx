import React, { useState } from "react";
import "../style/controller.css";

export default function Controller({
    reset,
    handleOperatorClick,
    handleNumClick,
    handleSymbolChange,
    handlePercentage
}) {
    return (
        <div className="controller">
            <div className="controller-symbols">
                <div className="controller-symbols__manipulators row">
                    <span
                        className="brick"
                        onClick={() => reset()}
                    >C</span>
                    <span className="brick" onClick={() => handleSymbolChange()}>+/-</span>
                    <span className="brick" onClick={() => handlePercentage()}>%</span>
                </div>
                {
                    [0,1,2].map((rNum, rIndex) => {
                        return (<div className="controller-symbols__nums row" key={rIndex}>
                            {
                                [1,2,3].map((cNum, cIndex) => {
                                    return <span key={cIndex}
                                            className="brick" 
                                            onClick={() => handleNumClick((rNum * 3) + cNum)}>
                                        {(rNum * 3) + cNum}
                                    </span>;
                                })
                            }
                        </div>)
                    })
                }
                <div className="controller-symbols__nums-addon row">
                    <span className="zero brick" onClick={() => handleNumClick(0)}>0</span>
                    <span className="brick" onClick={() => handleNumClick('.')}>.</span>
                </div>
            </div>
            <div className="controller-operators">
                {
                    ['÷', 'x', '-', '+', '='].map((operator, index) => {
                        return <span onClick={() => handleOperatorClick(operator)} className="brick" key={index}>{operator}</span>
                    })
                }
            </div>
        </div>
    )
}