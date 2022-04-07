import "./app.scss";
import { useEffect, useState } from "react";
import axios from "axios";

/*Need the query FROM React to WP API for articles with a specific Property ID. For example:

Query the API for:
all posts (not pages)
that contain prop_id 63807
return:
post title
post subtitle
link to article
10 most recent posts
in descending order

Format should be:

<a href ="link">Post Title</a>
Post Subtitle

Creat ea REACT page with header & footer (use the same structure for the CMS one) and populate the page with the data*/

function App() {
  // react hooks
  const [data, setData] = useState();
  const [propId, setPropId] = useState("");
  const [selectedArticles, setSelectedArticles] = useState([]);

  // function to pull page data
  useEffect(() => {
    const dataUrl = [
      "https://magazine.tablethotels.com/en/wp-json/wp/v2/posts?_fields=id,title,link,acf&per_page=100&page=1",
      "https://magazine.tablethotels.com/en/wp-json/wp/v2/posts?_fields=id,title,link,acf&per_page=100&page=2",
      "https://magazine.tablethotels.com/en/wp-json/wp/v2/posts?_fields=id,title,link,acf&per_page=100&page=3",
      "https://magazine.tablethotels.com/en/wp-json/wp/v2/posts?_fields=id,title,link,acf&per_page=100&page=4",
    ];

    const makeApiCall = async () => {
      try {
        const response1 = await axios(dataUrl[0]);
        const response2 = await axios(dataUrl[1]);
        const response3 = await axios(dataUrl[2]);
        const response4 = await axios(dataUrl[3]);

        let ArticlesArr = [
          ...response1.data,
          ...response2.data,
          ...response3.data,
          ...response4.data,
        ];

        setData(ArticlesArr);
      } catch (err) {
        console.error(err);
      }
    };
    makeApiCall();
  }, []);

  const handleChange = (e) => {
    setPropId(e.target.value);
  };

  //initiates selectArticles array so that it is a global variable.
  let selectArticles = [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data) {
      let allIdArticles = [];
      for (let i = 0; i <= data.length - 1; i++) {
        if (data[i].acf.property_id) {
          allIdArticles.push(data[i]);
        }
      }

      for (let j = 0; j <= allIdArticles.length - 1; j++) {
        let newArr = allIdArticles[j].acf.property_id.filter(
          (e) => e.id === propId
        );
        if (newArr.length > 0) {
          selectArticles.push(allIdArticles[j]);
        }
      }

      setSelectedArticles(selectArticles);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="findReceipt">Search by Property ID:</label>
        <br />
        <input
          type="text"
          value={propId}
          onChange={handleChange}
          id="findReceipt"
        />
        <button type="submit" className="submit lightbutton">
          <p className='buttontext'>Search</p>
        </button>
      </form>
      <ul>
        {selectedArticles.map((item) => {
          return (
            <a href={item.link}>
              <li>
                <h4>{item.title.rendered}</h4>
                <p>{item.acf.new_subtitle}</p>
              </li>
            </a>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
