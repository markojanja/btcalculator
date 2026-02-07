import { useState } from "react";
import Modal from "../components/Modal";
import {
  marginCalculationCFD,
  marginCalculationForex,
} from "../utils/calculations";
import {
  allCurrencyPairs,
  uniqueCurrencies,
  calcType,
  tradeTypeList,
  marginHowTo,
} from "../utils/helpers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { MdDeleteForever } from "react-icons/md";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fetchExchangeRate } from "../utils/fetchData";

const MarginCalculator = () => {
  const [activeType, setActveType] = useState("forex");
  const [calculations, setCalculations] = useState([]);
  const [contractSize, setContractSize] = useState(100000);
  const [lotSize, setLotSize] = useState(1);
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState(100);
  const [margin, setMargin] = useState("");
  const [pair, setPair] = useState("EUR/USD");
  const [tradeType, setTradeType] = useState("BUY");
  const [showConversion, setShowConversion] = useState(false);
  const [conversion, setConversion] = useState("");
  const [deposit, setDeposit] = useState("EUR");
  const [showModal, setShowModal] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };
  const handleTypeSelect = (value) => {
    if (!value) return;
    setActveType(value);
  };
  const handleSelect = (setter) => (value) => {
    setter(value);
  };
  const handleCalculate = () => {
    let res;
    let newPair;
    //test
    if (activeType === "forex") {
      setMargin("-");
      console.log("conversion", conversion);
      res = marginCalculationForex(
        contractSize,
        lotSize,
        price,
        leverage,
        pair,
        deposit,
        conversion,
      );
      newPair = {
        id: Date.now(),
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin: "-",
        leverage,
        marginRequired: parseFloat(res),
      };
    } else if (activeType === "cfd") {
      setLeverage("-");
      console.log("conversion cfd", conversion);

      res = marginCalculationCFD(
        contractSize,
        lotSize,
        price,
        margin,
        pair,
        deposit,
        conversion,
      );
      newPair = {
        id: Date.now(),
        pair,
        tradeType,
        contractSize,
        lotSize,
        price,
        margin,
        leverage: "-",
        marginRequired: parseFloat(res) * conversion,
      };
    } else {
      console.log("error");
      return;
    }

    setCalculations([...calculations, newPair]);
  };

  const handleCheckbox = () => {
    setShowConversion(!showConversion);
  };

  const handleDelete = (id) => {
    const newCalc = calculations.filter((item) => item.id !== id);
    setCalculations(newCalc);
  };

  const handleDepositSelect = async (value) => {
    const [base] = pair.split("/");
    const conversionPair = `${base}/${value}`;

    try {
      const conversionPrice = await fetchExchangeRate(conversionPair, API_KEY);
      setConversion(conversionPrice);
    } catch (err) {
      console.error("Conversion fetch failed", err);
    }

    setDeposit(value);
  };

  const totalPrice = calculations
    .map((item) => item.marginRequired)
    .reduce((sum, margin) => sum + margin, 0);

  const handleToggleModal = () => {
    setShowModal(true);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-screen gap-4">
      {showModal && <Modal setShowModal={setShowModal} content={marginHowTo} />}
      <Card className="w-1/3 p-4">
        <CardHeader className="flex justify-between items-center">
          <div className="flex gap-1">
            <h3 className="text-lg font-bold">Margin Calculator</h3>
            <div
              className="flex items-center justify-center mt-1"
              onClick={handleToggleModal}
            >
              <FaRegQuestionCircle style={{ cursor: "pointer" }} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <FieldGroup>
            <Field>
              <Label>Type Of Calculation</Label>
              <ToggleGroup
                type="single"
                value={activeType}
                onValueChange={handleTypeSelect}
                className="justify-start border-secondary"
              >
                {calcType.map((item) => (
                  <ToggleGroupItem
                    className="data-[state=on]:bg-primary data-[state=on]:text-white transition-all duration-150"
                    key={item}
                    value={item}
                  >
                    {item}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
          </FieldGroup>
          <FieldGroup className="flex flex-row">
            <Field>
              <Label>Symbol</Label>
              <Select value={pair} onValueChange={handleSelect(setPair)}>
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
            </Field>
            <Field>
              <Label>Order Type</Label>
              <Select
                value={tradeType}
                onValueChange={handleSelect(setTradeType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {tradeTypeList.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <FieldGroup className="flex flex-row">
            <Field>
              <Label>Contract Size</Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                placeholder={"set contact size..."}
                value={contractSize}
                onChange={handleChange(setContractSize)}
              />
            </Field>
            <Field>
              <Label>Lot Size</Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                placeholder={"set lot size..."}
                value={lotSize}
                onChange={handleChange(setLotSize)}
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="flex flex-row">
            <Field>
              <Label>Price</Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                placeholder={"set instrument price..."}
                value={price}
                onChange={handleChange(setPrice)}
              />
            </Field>
            <Field>
              {activeType === "forex" && (
                <>
                  <Label>Leverage</Label>
                  <Input
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    inputMode="decimal"
                    placeholder={"set leverage..."}
                    value={leverage}
                    onChange={handleChange(setLeverage)}
                  />
                </>
              )}
              {activeType === "cfd" && (
                <>
                  <Label>Margin (%)</Label>
                  <Input
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    inputMode="decimal"
                    placeholder={"set margin percentage..."}
                    value={margin}
                    onChange={handleChange(setMargin)}
                  />
                </>
              )}
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Label>Select Account Currency</Label>
              <Select value={deposit} onValueChange={handleDepositSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCurrencies.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <FieldGroup className="max-w-sm">
            <Field orientation="horizontal">
              <Checkbox
                id="conversion-change"
                name="conversion-change"
                checked={showConversion}
                onCheckedChange={handleCheckbox}
              />
              <Label htmlFor="converision-change">show conversion rate</Label>
            </Field>
          </FieldGroup>
          {showConversion && (
            <Input
              placeholder={"base/deposit e.q EUR/AUD"}
              value={conversion}
              onChange={handleChange(setConversion)}
            />
          )}
          <Button onClick={handleCalculate}>Calculate</Button>
        </CardContent>
      </Card>
      {calculations.length > 0 && (
        <Table className="max-w-[50%] mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lot Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Margin (%)</TableHead>
              <TableHead>Leverage</TableHead>
              <TableHead className="text-right">Margin Required</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {calculations.map((calc) => (
              <TableRow key={calc.id}>
                <TableCell>{calc.pair}</TableCell>
                <TableCell>{calc.tradeType}</TableCell>
                <TableCell>{calc.lotSize}</TableCell>
                <TableCell>{calc.price}</TableCell>
                <TableCell>{calc.margin}</TableCell>
                <TableCell>{calc.leverage}</TableCell>
                <TableCell className="text-right font-medium">
                  {Number(calc.marginRequired).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(calc.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <MdDeleteForever size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {calculations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  No calculations yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="w-full">
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-right text-base font-medium"
              >
                Total margin:{" "}
                <span className="ml-2 text-xl font-bold text-primary">
                  {Number(totalPrice).toFixed(2)}
                </span>{" "}
                {deposit}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
};

export default MarginCalculator;
