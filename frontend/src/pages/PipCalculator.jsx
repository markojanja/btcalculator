import { useState, useEffect } from "react";
import Info from "../components/Info";
import Modal from "../components/Modal";
import { allCurrencyPairs, uniqueCurrencies, pipHowTo } from "../utils/helpers";
import { fetchExchangeRate, fetchConversionRate } from "../utils/fetchData";
import { calculatePipValue } from "../utils/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { FaRegQuestionCircle } from "react-icons/fa";
import SettingsButton from "../components/SettingsButton";

const PipCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("EUR");
  const [base, setBase] = useState("EUR");
  const [quote, setQuote] = useState("USD");
  const [positionSize, setPositionSize] = useState(100000);
  const [pipSize, setPipSize] = useState(0.0001);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [prevExchangeRate, setPrevExchangeRate] = useState(1);
  const [pipValue, setPipValue] = useState(null);
  const [showConversion, setShowConversion] = useState(false);
  const [conversionRate, setConversionRate] = useState(1);
  const [isJPY, setIsJPY] = useState(false);
  const [checkboxDisabled, setCheckboxDisabled] = useState(true);
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [conversionPair, setConversionPair] = useState("");
  const [prevDepositCurrency, setPrevDepositCurrency] = useState("EUR");
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const handleFetchData = async () => {
      if (!editMode) {
        if (quote === depositCurrency) return;
        if (showConversion) {
          let pair = `${depositCurrency}/${quote}`;
          if (depositCurrency === "JPY") {
            pair = `${quote}/${depositCurrency}`;
          }
          setConversionPair(pair);
          const rate = await fetchConversionRate(pair, API_KEY);
          if (rate !== null) {
            setExchangeRate(1);
            setConversionRate(parseFloat(rate.toFixed(5)));
          }
        } else {
          setExchangeRate(parseFloat(prevExchangeRate));
          const rate = await fetchExchangeRate(
            currencyPair,
            API_KEY,
            prevExchangeRate,
          );
          if (rate !== null) {
            setExchangeRate(parseFloat(rate.toFixed(5)));
            setPrevExchangeRate(parseFloat(rate.toFixed(5)));
          }
        }
      }
    };

    handleFetchData();
  }, [
    showConversion,
    prevExchangeRate,
    base,
    depositCurrency,
    quote,
    editMode,
  ]);

  useEffect(() => {
    if (depositCurrency === quote) {
      setExchangeRate(1);
      setCheckBoxChecked(false);
      setCheckboxDisabled(true);
    } else if (depositCurrency === base) {
      setCheckBoxChecked(false);
      setCheckboxDisabled(true);
    } else {
      setExchangeRate(prevExchangeRate);
      setCheckBoxChecked(true);
      setCheckboxDisabled(false);
    }
  }, [depositCurrency, quote, prevExchangeRate, editMode]);

  const handleCurrencySelect = (value) => {
    setCurrnecyPair(value);

    const [baseCurrency, quoteCurrency] = value.split("/");

    setBase(baseCurrency);
    setQuote(quoteCurrency);
    setDepositCurrency(baseCurrency);
    setPrevDepositCurrency(baseCurrency);
    setPipValue(null);

    if (quoteCurrency.includes("JPY")) {
      setPipSize(0.01);
    } else {
      setPipSize(0.0001);
    }

    if (baseCurrency === baseCurrency || baseCurrency === quoteCurrency) {
      setShowConversion(false);
      setCheckBoxChecked(false);
      setCheckboxDisabled(false);
    } else {
      setShowConversion(true);
      setCheckBoxChecked(true);
      setCheckboxDisabled(true);
    }
  };

  const handleDepositCurrency = (value) => {
    const newDepositCurrency = value;

    setDepositCurrency(newDepositCurrency);
    setIsJPY(newDepositCurrency === "JPY");
    setPipValue(null);
    if (
      base === newDepositCurrency ||
      quote === newDepositCurrency ||
      newDepositCurrency === base ||
      depositCurrency === quote
    ) {
      setShowConversion(false);
      setCheckBoxChecked(false);
      setCheckboxDisabled(true);
    } else {
      setShowConversion(true);
      setCheckBoxChecked(true);
      setCheckboxDisabled(false);
    }
  };

  const handleClick = () => {
    const res = calculatePipValue(
      pipSize,
      positionSize,
      exchangeRate,
      conversionRate,
      showConversion,
      isJPY,
    );
    setPipValue(res);
  };

  const handleCheckbox = (value) => {
    setShowConversion(value);
    setCheckBoxChecked(!checkBoxChecked);

    setDepositCurrency(prevDepositCurrency);
  };

  const handleExchangeRateInput = (e) => {
    const newRate = e.target.value ? parseFloat(e.target.value) : "";
    setExchangeRate(newRate);
  };

  const handlePositionSizeInput = (e) => {
    setPositionSize(e.target.value ? parseFloat(e.target.value) : "");
  };
  const handlePipSizeInput = (e) => {
    setPipSize(e.target.value ? parseFloat(e.target.value) : "");
  };
  const handleConverisonInput = (e) => {
    setConversionRate(parseFloat(e.target.value));
  };

  const handleToggleModal = () => {
    setShowModal(true);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-screen gap-4">
      {showModal && <Modal setShowModal={setShowModal} content={pipHowTo} />}
      <Info editMode={editMode} />

      <Card className={`w-1/3 p-4  ${editMode ? "border-primary border" : ""}`}>
        <CardHeader className="flex justify-between items-center">
          <div className="flex gap-1">
            <h3 className="text-lg font-bold">Pip Value Calculator</h3>
            <div
              className="flex items-center justify-center mt-1"
              onClick={handleToggleModal}
            >
              <FaRegQuestionCircle style={{ cursor: "pointer" }} />
            </div>
          </div>
          <SettingsButton editMode={editMode} setEditMode={setEditMode} />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label>Symbol</Label>
          <Select value={currencyPair} onValueChange={handleCurrencySelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>

            <SelectContent>
              {allCurrencyPairs.map((pair) => (
                <SelectItem key={pair} value={pair}>
                  {pair}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>Exchange Rate</Label>
          <Input
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            value={exchangeRate}
            onChange={handleExchangeRateInput}
            disabled={!editMode}
            type="number"
            inputMode="decimal"
          />
          <Label>Position Size</Label>
          <Input
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder={"e.g 100,000"}
            value={positionSize}
            onChange={handlePositionSizeInput}
            disabled={showConversion}
            type="number"
            inputMode="decimal"
          />
          <Label>Pip Size</Label>
          <Input
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder={"e.g 0.0001"}
            value={pipSize}
            onChange={handlePipSizeInput}
            disabled={showConversion}
            type="number"
            inputMode="decimal"
          />
          <Label>Accont Currency</Label>
          <Select value={depositCurrency} onValueChange={handleDepositCurrency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>

            <SelectContent>
              {uniqueCurrencies.map((pair) => (
                <SelectItem key={pair} value={pair}>
                  {pair}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldGroup className="max-w-sm">
            <Field orientation="horizontal">
              <Checkbox
                id="conversion-change"
                name="conversion-change"
                checked={checkBoxChecked}
                disabled={checkboxDisabled}
                onCheckedChange={handleCheckbox}
              />
              <Label htmlFor="converision-change">show conversion rate</Label>
            </Field>
          </FieldGroup>

          {showConversion && (
            <>
              <Label>
                Conversion Rate{conversionPair ? ` for: ${conversionPair}` : ""}
              </Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder={"e.g 1.10018"}
                value={conversionRate}
                onChange={handleConverisonInput}
                disabled={!editMode}
                type="number"
                inputMode="decimal"
              />
            </>
          )}
          <Button className="btn" onClick={handleClick}>
            Calculate
          </Button>
        </CardContent>
      </Card>
      {pipValue && (
        <Card className="w-1/3">
          <CardContent>
            <CardTitle>{`Pip value: ${pipValue} ${depositCurrency}`}</CardTitle>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PipCalculator;
