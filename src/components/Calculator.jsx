import React from "react";
import Display from "./Display";
import Controller from './Controller'

export default class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            histories: [],
            currentOperandLeft: '0',
            currentOperandsRight: [],
            currentResult: 0,
            mode: "choosingDivident",
            isResultSettled: false
        };
        this.handleOperatorClick = this.handleOperatorClick.bind(this);
        this.reset = this.reset.bind(this);
        this.handleNumClick = this.handleNumClick.bind(this);
    }
    reset() {
        this.setState({
            currentOperandLeft: '0',
            currentOperandsRight: [],
            currentResult: 0,
            mode: 'choosingDivident',
            histories: [],
            isResultSettled: false
        });
    }
    handleNumClick(num) {
        if (this.state.mode === 'choosingDivident') {
            if (this.state.isResultSettled) {
                this.setState({
                    histories: this.state.histories.concat([{
                        operandLeft: this.state.currentOperandLeft,
                        operandsRight: this.deepClone(this.state.currentOperandsRight),
                        result: this.state.currentResult
                    }]),
                    isResultSettled: false,
                    currentOperandLeft: num.toString(),
                    currentOperandsRight: [],
                    currentResult: 0,
                });
                return;
            }

            this.setState({
                currentOperandLeft: this.state.currentOperandLeft === '0' ? num.toString() : this.state.currentOperandLeft + num
            })
            
            setTimeout(() => {
                this.setState({
                    currentResult: this.calculateResult(this.state.currentOperandLeft, [])
                })
            }, 0);
        }
        if (this.state.mode === 'choosingDivisor') {
            const lastOperandsRight = this.state.currentOperandsRight.slice(-1);
            const newLastOperandsRight = [Object.assign(lastOperandsRight[0], {
                operandRight: lastOperandsRight[0].operandRight + num
            })];
            const newCurrentOperandsRight = this.state.currentOperandsRight.slice(0, -1).concat(newLastOperandsRight)
            this.setState({
                currentOperandsRight: newCurrentOperandsRight,
                currentResult: this.calculateResult(this.state.currentOperandLeft, this.state.currentOperandsRight)
            });
        }
    }
    deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }
    handleOperatorClick(operator) {
        if (operator === '=') {
            this.setState({
                isResultSettled: true,
                mode: 'choosingDivident',
            });
        } else {
            this.setState({
                currentOperandsRight: this.state.currentOperandsRight.concat([{
                    operandRight: '',
                    operator
                }]),
                mode: 'choosingDivisor'
            });
        }
    }
    calculateResult(operandLeft, operandsRight) {
        // 基线条件
        if (operandsRight.length === 0) {
            return Number(operandLeft);
        }

        const firstRight = operandsRight[0];
        const restRight = operandsRight.slice(1);
        let res = '';
        if (firstRight.operator === '+') {
            res = Number(operandLeft) + this.calculateResult(firstRight.operandRight, restRight);
        }
        if (firstRight.operator === '-') {
            res = operandLeft - this.calculateResult(firstRight.operandRight, restRight);
        }
        if (firstRight.operator === 'x') {
            res = this.calculateResult(operandLeft * firstRight.operandRight, restRight);
        }
        if (firstRight.operator === '÷') {
            res = this.calculateResult(operandLeft / firstRight.operandRight, restRight);
        }
        return Number(res);
    }
    render() {
        return (
            <div>
                <Display 
                    histories={this.state.histories} 
                    currentOperandLeft={this.state.currentOperandLeft}
                    currentOperandsRight={this.state.currentOperandsRight}
                    currentResult={this.state.currentResult}
                    isResultSettled={this.state.isResultSettled}
                    >
                </Display>
                <Controller 
                    reset={this.reset} 
                    handleOperatorClick={this.handleOperatorClick} 
                    handleNumClick={this.handleNumClick}>
                </Controller>
            </div>
        )
    }
}