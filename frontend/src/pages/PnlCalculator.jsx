import { useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import {
  allCurrencyPairs,
  uniqueCurrencies,
  tradeTypeList,
  pnlHowTo,
} from "../utils/helpers";
import { calculateProfitAndLoss } from "../utils/calculations";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { FaRegQuestionCircle } from "react-icons/fa";
import SettingsButton from "../components/SettingsButton";

const PnlCalculator = () => {
  const [currencyPair, setCurrnecyPair] = useState("EUR/USD");
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [openPrice, setOpenPrice] = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [tradeSize, setTradeSize] = useState(1);
  const [tradeType, setTradeType] = useState("BUY");
  const [pnl, setPnl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [conversionRate, setConverisonRate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [contractSize, setContractSize] = useState(100000);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchData = async (pair) => {
    const res = await axios.get(
      `https://api.twelvedata.com/exchange_rate?symbol=${pair}&apikey=${API_KEY}`,
    );

    return res.data.rate;
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSelect = (setter) => (value) => {
    setter(value);
    console.log(uniqueCurrencies);
  };

  const calculatePnl = async () => {
    const [, quote] = currencyPair.split("/");

    let result = calculateProfitAndLoss(
      openPrice,
      closePrice,
      tradeSize,
      contractSize,
      tradeType,
    );
    setPnl(parseFloat(result).toFixed(2));

    if (quote !== depositCurrency) {
      setPnl("");
      let pair = `${quote}/${depositCurrency}`;

      if (!allCurrencyPairs.includes(pair)) {
        pair = `${depositCurrency}/${quote}`;
      }
      let conversion = await fetchData(pair);
      if (conversionRate) {
        conversion = conversionRate;
      }

      result = result * conversion;
      setPnl(parseFloat(result).toFixed(2));
    }
  };

  const handleToggleModal = () => {
    setShowModal(true);
  };
  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full h-screen gap-4 p-2">
      {showModal && <Modal setShowModal={setShowModal} content={pnlHowTo} />}
      <Card
        className={`w-full lg:w-1/3 p-4  ${editMode ? "border-primary border" : ""}`}
      >
        <CardHeader className="flex justify-between items-center">
          <div className="flex gap-1">
            <h3 className="text-lg font-bold">PnL Calculator</h3>
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
          {editMode ? (
            <FieldGroup>
              <Field>
                <Label>Symbol</Label>
                <Input
                  type="text"
                  value={currencyPair}
                  onChange={handleChange(setCurrnecyPair)}
                />
              </Field>
            </FieldGroup>
          ) : (
            <FieldGroup>
              <Field>
                <Label>Symbol</Label>
                <Select
                  value={depositCurrency}
                  onValueChange={handleSelect(setCurrnecyPair)}
                >
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
            </FieldGroup>
          )}

          <FieldGroup>
            <Field>
              <Label>Contract Size</Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                placeholder="set contract size..."
                value={contractSize}
                onChange={handleChange(setContractSize)}
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <Label>Order type</Label>
              <Select
                value={tradeType}
                onValueChange={handleSelect(setTradeType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Symbol" />
                </SelectTrigger>
                <SelectContent>
                  {tradeTypeList.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <Label>Open Price</Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                placeholder={"set close price"}
                value={openPrice}
                onChange={handleChange(setOpenPrice)}
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <Label>Close Price</Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                placeholder={"set close price"}
                value={closePrice}
                onChange={handleChange(setClosePrice)}
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Label>Lots</Label>
              <Input
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                inputMode="decimal"
                label={"trade size(lots)"}
                placeholder={"set lots..."}
                value={tradeSize}
                onChange={handleChange(setTradeSize)}
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Label>Account Currency</Label>
              <Select
                value={depositCurrency}
                onValueChange={handleSelect(setDepositCurrency)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select deposit currency" />
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

          {editMode && (
            <FieldGroup>
              <Field>
                <Label>Conversion pair price</Label>
                <Input
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  type="number"
                  inputMode="decimal"
                  placeholder={"example price of USD/JPY"}
                  onChange={handleChange(setConverisonRate)}
                />
              </Field>
            </FieldGroup>
          )}
          <Button onClick={calculatePnl}>Calculate</Button>
        </CardContent>
      </Card>
      {pnl && (
        <Card className="w-full lg:w-1/3">
          <CardContent>
            <CardTitle>{`PNL: ${pnl} ${depositCurrency}`}</CardTitle>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PnlCalculator;
