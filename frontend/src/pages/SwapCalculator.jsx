import { useState } from "react";
import { format } from "date-fns";
import { Repeat } from "lucide-react";
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
import DatePicker from "../components/DatePicker";
import {
  CalculatorPage,
  FormCard,
  FormField,
  FormSection,
  HelpDialog,
  NumberInput,
  ResultCard,
  ResultDetails,
  ResultValue,
  SegmentedControl,
  SelectInput,
} from "../components/CalculatorUI";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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

  const dailySwap = result ? parseFloat(result.dailySwap) : 0;
  const totalSwap = parseFloat(test);
  const dateRange =
    openDate && closeDate
      ? `${format(openDate, "dd/MM/yyyy")} – ${format(closeDate, "dd/MM/yyyy")}`
      : "No dates selected";
  const pointUnit = { money: "per lot", points: "points", percentage: "% / year" };

  return (
    <CalculatorPage
      icon={Repeat}
      title="Swap"
      description="Overnight swap for a position held between two dates."
      onHelp={handleToggleModal}
    >
      {showModal && (
        <HelpDialog
          title="Swap"
          content={swapHowTo.content}
          onClose={() => setShowModal(false)}
        />
      )}

      <FormCard onSubmit={handleCalculateSwap}>
        <FormSection title="Symbol settings" columns={3}>
          <FormField label="Symbol">
            {(id) => (
              <SelectInput
                id={id}
                value={symbol}
                onChange={handleSelect(setSymbol)}
                options={allCurrencyPairs}
                placeholder="Select symbol"
              />
            )}
          </FormField>
          <FormField label="Contract size">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 100000"
                value={contractSize}
                onChange={handleChange(setContractSize)}
              />
            )}
          </FormField>
          <FormField label="Pip size">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 0.00001"
                value={pipSize}
                onChange={handleChange(setPipSize)}
              />
            )}
          </FormField>
        </FormSection>

        <FormSection title="Swap settings">
          <FormField label="Calculation type">
            {(id) => (
              <SelectInput
                id={id}
                value={activeCalculation}
                onChange={handleSelect(setActiveCalculation)}
                options={calculationType}
                format={capitalize}
              />
            )}
          </FormField>
          <FormField label="Triple swap day">
            {(id) => (
              <SelectInput
                id={id}
                value={activeDay}
                onChange={handleSelect(setActiveDay)}
                options={workingDays}
              />
            )}
          </FormField>
          <FormField label="Long swap">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. -6.5"
                value={long}
                onChange={handleChange(setLong)}
                unit={pointUnit[activeCalculation]}
              />
            )}
          </FormField>
          <FormField label="Short swap">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 1.2"
                value={short}
                onChange={handleChange(setShort)}
                unit={pointUnit[activeCalculation]}
              />
            )}
          </FormField>
        </FormSection>

        <FormSection title="Trade">
          <FormField label="Direction">
            <SegmentedControl
              value={tradeType}
              onChange={setTradeType}
              options={tradeTypes}
            />
          </FormField>
          <FormField label="Account currency">
            {(id) => (
              <SelectInput
                id={id}
                value={deposit}
                onChange={handleSelect(setDeposit)}
                options={uniqueCurrencies}
              />
            )}
          </FormField>
          <FormField label="Asset price">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 1.08500"
                value={assetPrice}
                onChange={handleChange(setAssetPrice)}
              />
            )}
          </FormField>
          <FormField label="Volume">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 1"
                value={lotsTraded}
                onChange={handleChange(setLotsTraded)}
                unit="lots"
              />
            )}
          </FormField>
          <FormField label="Open date">
            <DatePicker
              value={openDate}
              onChange={setOpenDate}
              placeholder="Pick open date"
              className="h-10 w-full"
            />
          </FormField>
          <FormField label="Close date">
            <DatePicker
              value={closeDate}
              onChange={setCloseDate}
              placeholder="Pick close date"
              className="h-10 w-full"
            />
          </FormField>
        </FormSection>
      </FormCard>

      <ResultCard
        empty={
          <>
            <Repeat className="size-6" />
            Fill in the form and press Calculate.
          </>
        }
      >
        {result && (
          <div className="space-y-3">
            <ResultValue
              label={`Total swap ${totalSwap < 0 ? "charged" : "paid"}`}
              value={totalSwap.toFixed(3)}
              unit={result.deposit}
              tone={totalSwap < 0 ? "negative" : "positive"}
              note={dateRange}
            />
            <ResultDetails
              rows={[
                [
                  `Daily swap (${dailySwap < 0 ? "charged" : "paid"})`,
                  `${dailySwap.toFixed(3)} ${result.deposit}`,
                ],
                ["Symbol", result.symbol],
                ["Direction", result.tradeType],
                ["Calculation type", capitalize(result.activeCalculation)],
                ["Triple swap day", result.swapDay],
                ["Asset price", result.assetPrice || "—"],
                ["Volume", `${result.lotsTraded || 0} lots`],
              ]}
            />
          </div>
        )}
      </ResultCard>
    </CalculatorPage>
  );
};

export default SwapCalculator;
