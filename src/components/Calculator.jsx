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
        this.handlePercentage = this.handlePercentage.bind(this);
        this.handleSymbolChange = this.handleSymbolChange.bind(this);
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
                    currentOperandLeft: num === '.' ? '0.' : num.toString(),
                    currentOperandsRight: [],
                    currentResult: 0,
                });
                return;
            }
            
            // 只能有一个小数点
            if (num === '.' && this.state.currentOperandLeft.toString().includes('.')) return;

            // 小数点和0相遇时
            let currentOperandLeft = this.state.currentOperandLeft.toString() + num;
            if (this.state.currentOperandLeft.toString() === '0') {
                if (num === '.') {
                    num = '0.';
                }
                currentOperandLeft = num; 
            }
            this.setState({
                currentOperandLeft
            })
            setTimeout(() => {
                this.setState({
                    currentResult: this.calculateResult(this.state.currentOperandLeft, [])
                })
            }, 0);
        }
        if (this.state.mode === 'choosingDivisor') {
            const lastOperandsRight = this.state.currentOperandsRight.slice(-1);

            // 只能有一个小数点
            if (num === '.' && lastOperandsRight[0].operandRight.toString().includes('.')) return;

            // 小数点和0相遇时
            let operandRight = lastOperandsRight[0].operandRight.toString() + num;
            if (lastOperandsRight[0].operandRight.toString() === '') {
                if (num === '.') {
                    num = '0.';
                }
                operandRight = num; 
            }
            const newLastOperandsRight = [Object.assign(lastOperandsRight[0], {
                operandRight
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
        operandLeft = Number(operandLeft);
        // 基线条件
        if (operandsRight.length === 0) {
            return operandLeft;
        }

        const firstRight = operandsRight[0];
        const restRight = operandsRight.slice(1);
        const operandLeftDecimalLength = this.countDecimals(operandLeft);

        // 通过将小数变成整数，解决双精度浮点数的小数运算精度丢失问题
        if (firstRight.operator === '+') {
            const operandRight = this.calculateResult(firstRight.operandRight, restRight);
            const operandRightDecimalLength = this.countDecimals(operandRight);
            const maxDecimalLength = Math.pow(10, Math.max(operandLeftDecimalLength, operandRightDecimalLength));
            return (operandLeft * maxDecimalLength + operandRight * maxDecimalLength) / maxDecimalLength;
        }
        if (firstRight.operator === '-') {
            const operandRight = this.calculateResult(firstRight.operandRight, restRight);
            
            const operandRightDecimalLength = this.countDecimals(operandRight);
            const maxDecimalLength = Math.pow(10,  Math.max(operandLeftDecimalLength, operandRightDecimalLength));
            return (operandLeft * maxDecimalLength - operandRight * maxDecimalLength) / maxDecimalLength;
        }
        if (firstRight.operator === 'x') {
            const operandRightDecimalLength = this.countDecimals(firstRight.operandRight);
            const result = (operandLeft * Math.pow(10, operandLeftDecimalLength)) * (firstRight.operandRight * Math.pow(10, operandRightDecimalLength)) / (Math.pow(10, operandLeftDecimalLength) * Math.pow(10, operandRightDecimalLength));
            return this.calculateResult(result, restRight);
        }
        if (firstRight.operator === '÷') {
            const operandRightDecimalLength = this.countDecimals(firstRight.operandRight);
            const maxDecimalLength = Math.pow(10, Math.max(operandLeftDecimalLength, operandRightDecimalLength));
            const result = (operandLeft * maxDecimalLength) / (firstRight.operandRight * maxDecimalLength)
            return this.calculateResult(result, restRight);
        }
    }
    countDecimals(value) {
        value = Number(value);
        if(Math.floor(value) === value) return 0;
        return value.toString().split(".")[1].length || 0; 
    }
    handlePercentage() {
        if (this.state.mode === 'choosingDivident') {
            this.setState({
                currentOperandLeft: this.state.currentOperandLeft / 100
            })
        }
        if (this.state.mode === 'choosingDivisor') {
            const lastOperandsRight = this.state.currentOperandsRight.slice(-1);
            const newLastOperandsRight = [Object.assign(lastOperandsRight[0], {
                operandRight: lastOperandsRight[0].operandRight / 100
            })];
            this.setState({
                statecurrentOperandsRight: newLastOperandsRight
            })
        }
        setTimeout(() => {
            this.setState({
                currentResult: this.calculateResult(this.state.currentOperandLeft, this.state.currentOperandsRight)
            })
        }, 0);
    }
    handleSymbolChange() {
        if (this.state.mode === 'choosingDivident') {
            this.setState({
                currentOperandLeft: this.state.currentOperandLeft > 0 ? -this.state.currentOperandLeft : Math.abs(this.state.currentOperandLeft)
            })
        }
        if (this.state.mode === 'choosingDivisor') {
            const lastOperandsRight = this.state.currentOperandsRight.slice(-1);
            const newLastOperandsRight = [Object.assign(lastOperandsRight[0], {
                operandRight: lastOperandsRight[0].operandRight > 0 ? -lastOperandsRight[0].operandRight : Math.abs(lastOperandsRight[0].operandRight)
            })];
            this.setState({
                statecurrentOperandsRight: newLastOperandsRight
            })
        }
        setTimeout(() => {
            this.setState({
                currentResult: this.calculateResult(this.state.currentOperandLeft, this.state.currentOperandsRight)
            })
        }, 0);
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
                    handleSymbolChange={this.handleSymbolChange}
                    handlePercentage={this.handlePercentage}
                    handleNumClick={this.handleNumClick}>
                </Controller>
            </div>
        )
    }
}