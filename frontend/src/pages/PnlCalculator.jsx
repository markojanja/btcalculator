import { useState } from "react";
import { DollarSign } from "lucide-react";
import {
  allCurrencyPairs,
  uniqueCurrencies,
  tradeTypeList,
  pnlHowTo,
} from "../utils/helpers";
import { calculateProfitAndLoss } from "../utils/calculations";
import { fetchConversionRate } from "../utils/fetchData";
import { Input } from "@/components/ui/input";
import {
  CalculatorPage,
  FormCard,
  FormField,
  FormSection,
  HelpDialog,
  NumberInput,
  RateModeToggle,
  ResultCard,
  ResultDetails,
  ResultValue,
  SegmentedControl,
  SelectInput,
} from "../components/CalculatorUI";

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

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSelect = (setter) => (value) => {
    setter(value);
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
      // A rate typed in by the user wins; otherwise fetch it.
      const conversion = conversionRate || (await fetchConversionRate(pair));
      if (conversion === null) return; // fetch failed; a toast shows why

      result = result * conversion;
      setPnl(parseFloat(result).toFixed(2));
    }
  };

  const handleToggleModal = () => {
    setShowModal(true);
  };
  const pnlNumber = Number(pnl);

  return (
    <CalculatorPage
      icon={DollarSign}
      title="Profit & loss"
      description="Result of a closed trade, converted to your account currency."
      onHelp={handleToggleModal}
      action={<RateModeToggle manual={editMode} onChange={setEditMode} />}
    >
      {showModal && (
        <HelpDialog
          title="Profit & loss"
          content={pnlHowTo.content}
          onClose={() => setShowModal(false)}
        />
      )}

      <FormCard onSubmit={calculatePnl}>
        <FormSection title="Instrument">
          <FormField
            label="Symbol"
            hint={editMode ? "Type any symbol, e.g. XAU/USD." : undefined}
          >
            {(id) =>
              editMode ? (
                <Input
                  id={id}
                  className="h-10"
                  value={currencyPair}
                  onChange={handleChange(setCurrnecyPair)}
                />
              ) : (
                <SelectInput
                  id={id}
                  value={currencyPair}
                  onChange={handleSelect(setCurrnecyPair)}
                  options={allCurrencyPairs}
                  placeholder="Select symbol"
                />
              )
            }
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
        </FormSection>

        <FormSection title="Trade">
          <FormField label="Direction" className="sm:col-span-2">
            <SegmentedControl
              value={tradeType}
              onChange={setTradeType}
              options={tradeTypeList}
            />
          </FormField>
          <FormField label="Open price">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 1.08500"
                value={openPrice}
                onChange={handleChange(setOpenPrice)}
              />
            )}
          </FormField>
          <FormField label="Close price">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 1.09000"
                value={closePrice}
                onChange={handleChange(setClosePrice)}
              />
            )}
          </FormField>
          <FormField label="Volume">
            {(id) => (
              <NumberInput
                id={id}
                placeholder="e.g. 1"
                value={tradeSize}
                onChange={handleChange(setTradeSize)}
                unit="lots"
              />
            )}
          </FormField>
          <FormField label="Account currency">
            {(id) => (
              <SelectInput
                id={id}
                value={depositCurrency}
                onChange={handleSelect(setDepositCurrency)}
                options={uniqueCurrencies}
                placeholder="Select currency"
              />
            )}
          </FormField>
          {editMode && (
            <FormField
              label="Conversion rate"
              hint="Price of the pair between the quote and account currency, e.g. USD/JPY."
              className="sm:col-span-2"
            >
              {(id) => (
                <NumberInput
                  id={id}
                  placeholder="e.g. 151.20"
                  onChange={handleChange(setConverisonRate)}
                />
              )}
            </FormField>
          )}
        </FormSection>
      </FormCard>

      <ResultCard
        empty={
          <>
            <DollarSign className="size-6" />
            Fill in the trade and press Calculate.
          </>
        }
      >
        {pnl && (
          <>
            <ResultValue
              label={pnlNumber >= 0 ? "Profit" : "Loss"}
              value={pnlNumber > 0 ? `+${pnl}` : pnl}
              unit={depositCurrency}
              tone={pnlNumber >= 0 ? "positive" : "negative"}
            />
            <ResultDetails
              rows={[
                ["Symbol", currencyPair],
                ["Direction", tradeType],
                ["Open → close", `${openPrice} → ${closePrice}`],
                ["Volume", `${tradeSize} lots`],
              ]}
            />
          </>
        )}
      </ResultCard>
    </CalculatorPage>
  );
};

export default PnlCalculator;
