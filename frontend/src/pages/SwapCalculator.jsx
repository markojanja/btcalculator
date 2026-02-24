import { useState } from "react";
import { format } from "date-fns";
import Modal from "../components/Modal";

import {
  allCurrencyPairs,
  uniqueCurrencies,
  swapHowTo,
} from "../utils/helpers";
import {
  calculateDailySwap,
  getDatesInRange,
  getTotalSwap,
} from "../utils/calculations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { FaRegQuestionCircle } from "react-icons/fa";
import DatePicker from "../components/DatePicker";

const SwapCalculator = () => {
  const calculationType = ["money", "points", "percentage"];
  const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const tradeTypes = ["BUY", "SELL"];
  const [symbol, setSymbol] = useState("EUR/USD");
  const [contractSize, setContractSize] = useState(100000);
  const [pipSize, setPipSize] = useState(0.00001);
  const [activeCalculation, setActiveCalculation] = useState("money");
  const [activeDay, setActiveDay] = useState("Wednesday");
  const [long, setLong] = useState("");
  const [short, setShort] = useState("");
  const [deposit, setDeposit] = useState("USD");
  const [assetPrice, setAssetPrice] = useState("");
  const [lotsTraded, setLotsTraded] = useState("");
  const [tradeType, setTradeType] = useState("BUY");
  const [openDate, setOpenDate] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [result, setResult] = useState();
  const [test, setTest] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSelect = (setter) => (value) => {
    setter(value);
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleCalculateSwap = () => {
    const swapCalculation = calculateDailySwap(
      activeCalculation,
      contractSize,
      pipSize,
      long,
      short,
      lotsTraded,
      assetPrice,
    );
    const dates = getDatesInRange(openDate, closeDate, activeDay);
    const dailySwap =
      tradeType === "BUY" ? swapCalculation.long : swapCalculation.short;
    const res = {
      symbol,
      activeCalculation,
      swapDay: activeDay,
      lotsTraded,
      assetPrice,
      tradeType,
      deposit,
      dailySwap: dailySwap,
    };

    setResult(res);
    let total = getTotalSwap(dates, dailySwap);
    setTest(total);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-screen gap-4 p-2">
      {showModal && <Modal setShowModal={setShowModal} content={swapHowTo} />}
      <Card className={`w-full lg:w-1/3 p-4`}>
        <CardHeader className="flex justify-between items-center">
          <div className="flex gap-1">
            <h3 className="text-lg font-bold">Swap Calculator</h3>
            <div
              className="flex items-center justify-center mt-1"
              onClick={handleToggleModal}
            >
              <FaRegQuestionCircle style={{ cursor: "pointer" }} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardDescription className="flex items-start text-md">
            Symbol settings
          </CardDescription>

          <FieldGroup className="flex flex-row gap-1 lg:gap-2">
            <Field>
              <Label>Symbol</Label>
              <Select value={symbol} onValueChange={handleSelect(setSymbol)}>
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
              <Label>Contract Size</Label>
              <Input
                placeholder={"set contract size..."}
                value={contractSize}
                onChange={handleChange(setContractSize)}
              />
            </Field>
            <Field>
              <Label>Pip size</Label>
              <Input
                placeholder={"set pip size..."}
                value={pipSize}
                onChange={handleChange(setPipSize)}
              />
            </Field>
          </FieldGroup>
          <CardDescription className="flex items-start text-md">
            Swap settings
          </CardDescription>

          <FieldGroup className="flex flex-row">
            <Field>
              <Label>Calculation Type</Label>
              <Select
                value={activeCalculation}
                onValueChange={handleSelect(setActiveCalculation)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select calc type" />
                </SelectTrigger>

                <SelectContent>
                  {calculationType.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>3-day swap</Label>
              <Select
                value={activeDay}
                onValueChange={handleSelect(setActiveDay)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select swap day" />
                </SelectTrigger>

                <SelectContent>
                  {workingDays.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <FieldGroup className="flex flex-row">
            <Field>
              <Label>Long swap</Label>
              <Input
                placeholder={"set long swap..."}
                value={long}
                onChange={handleChange(setLong)}
              />
            </Field>
            <Field>
              <Label>Short swap</Label>
              <Input
                placeholder={"set short swap..."}
                value={short}
                onChange={handleChange(setShort)}
              />
            </Field>
          </FieldGroup>
          <CardDescription className="flex items-start text-md">
            Trade settings
          </CardDescription>
          <FieldGroup className="flex flex-row">
            <Field>
              <Label>Account Currency</Label>
              <Select value={deposit} onValueChange={handleSelect(setDeposit)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select deposit type" />
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
            <Field>
              <Label>Trade Type</Label>
              <Select
                value={tradeType}
                onValueChange={handleSelect(setTradeType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>

                <SelectContent>
                  {tradeTypes.map((item) => (
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
              <Label>Asset Price</Label>
              <Input
                placeholder={"set asset price..."}
                value={assetPrice}
                onChange={handleChange(setAssetPrice)}
              />
            </Field>

            <Field>
              <Label>Lot Size</Label>
              <Input
                placeholder={"set lot size..."}
                value={lotsTraded}
                onChange={handleChange(setLotsTraded)}
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="flex flex-row">
            <Field>
              <Label>open date</Label>
              <DatePicker
                value={openDate}
                onChange={setOpenDate}
                placeholder="open date"
              />
            </Field>
            <Field>
              <Label>close date</Label>
              <DatePicker
                value={closeDate}
                onChange={setCloseDate}
                placeholder="close date"
              />
            </Field>
          </FieldGroup>
          <Button onClick={handleCalculateSwap}>Calculate</Button>
        </CardContent>
      </Card>
      {result && (
        <Card className="w-full lg:w-1/3">
          <CardContent className="flex flex-col items-start">
            <h4>Symbol: {result.symbol}</h4>
            <h4>Calculation Type: {result.activeCalculation}</h4>
            <h4>3-day Swap: {result.swapDay}</h4>
            <h4>Asset Price: {result.assetPrice}</h4>
            <h4>Lots: {result.lotsTraded}</h4>
            <h4>
              Daily swap {parseFloat(result.dailySwap).toFixed(3)}{" "}
              {result.dailySwap < 0 ? "is charged" : "is paid"}
            </h4>
            <h4 className="text-left font-semibold">
              TotalSwaps:{parseFloat(test).toFixed(3)}{" "}
              {`from ${format(openDate, "dd/MM/yyyy")} to ${format(closeDate, "dd/MM/yyyy")} `}{" "}
              {test < 0 ? " is being charged" : "is paid"}
            </h4>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SwapCalculator;
