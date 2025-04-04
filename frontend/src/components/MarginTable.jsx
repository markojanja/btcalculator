import { MdDeleteForever } from "react-icons/md";

const MarginTable = ({ calculations, totalPrice, deposit, handleDelete }) => {
  return (
    <div className="table-wrapper">
      <div style={{ width: "100%", margin: "0 auto", overflowX: "auto" }}>
        <table className="calculation-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>type</th>
              <th>Lot Size</th>
              <th>Price</th>
              <th>Margin(%)</th>
              <th>Leverage</th>
              <th>Margin Required</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc, index) => (
              <tr key={index}>
                <td>{calc.pair}</td>
                <td>{calc.tradeType}</td>
                <td>{calc.lotSize}</td>
                <td>{calc.price}</td>
                <td>{calc.margin}</td>
                <td>{calc.leverage}</td>
                <td>{parseFloat(calc.marginRequired.toFixed(2))}</td>
                <td>
                  <MdDeleteForever
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(calc.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 style={{ marginInline: "auto 0", textAlign: "right", padding: "0.5rem 0" }}>
        Total margin:{" "}
        <span style={{ fontWeight: "900", color: "oklch(0.723 0.219 149.579)", fontSize: "1.3em" }}>
          {parseFloat(totalPrice).toFixed(2)}
        </span>{" "}
        {deposit}
      </h4>
    </div>
  );
};

export default MarginTable;
