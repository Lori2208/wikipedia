import "./App.css";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSaveContext } from "./Context/appContext";
import Loading from "./Loading";
import { FaBookReader } from "react-icons/fa";

function Main() {
  const { saveForLater } = useSaveContext();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showNoResult, setShowNoResult] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    const autoSearch = async () => {
      if (search.length >= 3) {
        setShowLoading(true);
        const endpoint = `:https//en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${search}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw Error(response.statusText);
        }

        if (response) {
          setShowLoading(false);
        }
        const json = await response.json();
        setResults(json.query.search);
        setShowNoResult(json.query.searchinfo.totalhits === 0);
      } else {
        setResults([]);
      }
    };

    autoSearch();
  }, [search]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <div className="App">
      <div className="favorite">
        {showDot && <div className="favorite__dot"></div>}
        <Link style={{ color: "white" }} to="/save">
          <FaBookReader size={25} />
        </Link>
      </div>
      <header>
        <h1>Wikipedia</h1>
        <form className="search-box">
          <input
            type="search"
            placeholder="What are you looking for?"
            value={search}
            onChange={(event) => handleSearch(event)}
          />
        </form>
      </header>

      <div className="results">
        {showNoResult && !showLoading && <h2>NO Results</h2>}

        {showLoading && <Loading />}
        {results.map((result, i) => (
          <div className="result" key={i}>
            <h3>{result.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: result.snippet }} />
            <button
              type="button"
              class="btn btn-info"
              onClick={() => {
                setShowDot(true);
                saveForLater(result);
              }}
            >
              Save later
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
