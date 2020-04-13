import React from "react";
import "../style/display.css";

export default function Display({
    histories,
    currentOperandLeft,
    currentOperandsRight,
    currentResult,
    isResultSettled
}) {
    return (
        <div className="display">
        {   
            histories && histories.map((history, index) => {
                return (
                    <div className="display-history" key={index}>
                        <div className="display-history__operand left">
                        {history.operandLeft}
                        </div>
                        {
                            history.operandsRight.map((operandsRightItem, i) => {
                                return (
                                    <div className="display-history__operands right" key={i}>
                                        <span className="display-history__operator">{operandsRightItem.operator}</span>
                                        <span className="display-history__operand right">{operandsRightItem.operandRight}</span>
                                    </div>
                                )
                            })
                        }
                        <div className="display-history__result">
                        {'= ' + history.result}
                        </div>
                    </div>
                )
            })
        }
        <div className="display-history current">
            <div className="display-history__operand left">
            {currentOperandLeft}
            </div>
            {
                currentOperandsRight.map((operandsRightItem, i) => {
                    return (
                        <div className="display-history__operands right" key={i}>
                            <span className="display-history__operator">{operandsRightItem.operator}</span>
                            <span className="display-history__operand right">{operandsRightItem.operandRight}</span>
                        </div>
                    )
                })
            }
            <div className={`display-history__result ${isResultSettled && 'active'}`}>
                {currentResult ? ('= ' + currentResult) : ''}
            </div>
        </div>
      </div>
    )
}