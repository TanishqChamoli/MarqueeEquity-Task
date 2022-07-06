import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const [query, setQuery] = useState("");
  const [companyData, setCompanyData] = useState("");
  const [savedCompanies, setSavedCompanies] = useState([]);

  const searchFromSite = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    };
    const response = await fetch(
      "http://localhost:5000/search",
      requestOptions
    );
    const data = await response.json();
    setCompanyData(data);
  };

  const getAllSaved = async () => {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch("http://localhost:5000/cin", requestOptions);
    const data = await response.json();
    setSavedCompanies(data);
  };

  const addCompany = async (cin, name) => {
    var requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cin }),
    };
    const response = await fetch(
      "http://localhost:5000/check-duplicate",
      requestOptions
    );
    const data = await response.json();
    if (data.length) {
      alert("Duplicate Row");
      return;
    }

    requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cin, name }),
    };
    await fetch("http://localhost:5000/cin", requestOptions);
    getAllSaved();
  };

  const deleteCompany = async (db_id) => {
    const requestOptions = {
      method: "GET",
    };
    await fetch("http://localhost:5000/cin/" + db_id, requestOptions);
    getAllSaved();
  };

  useEffect(() => {
    getAllSaved();
  }, [companyData]);

  useEffect(() => {
    if (query.length) searchFromSite();
    else setCompanyData("");
  }, [query]);

  return (
    <div className="App">
      <div>
        <h1>Search Bar</h1>
        <br />
        <input
          onChange={(e) => {
            setQuery(e.target.value.trim());
          }}
          className="wider-input wideText"
        ></input>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: companyData }}
        onClick={(e) => {
          addCompany(e.target.id.split("/")[2], e.target.innerText);
        }}
        className="alignCenter wideText"
      ></div>

      {savedCompanies.length ? (
        <div className="alignCenter wideText">
          <table>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>CIN</th>
              <th>Delete</th>
            </tr>
            {savedCompanies.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.db_id}</td>
                  <td>{val.name}</td>
                  <td>{val.cin}</td>
                  <td>
                    <button
                      onClick={() => {
                        deleteCompany(val.db_id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      ) : (
        <p className="alignCenter wideText">No Saved Companies</p>
      )}
    </div>
  );
}

export default App;
