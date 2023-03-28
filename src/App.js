import { React, useState, useEffect } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import AWS from 'aws-sdk';
import Papa from 'papaparse';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import staticDataCSVFile from './prices_for_postman_test_final.csv';
// import ReactJson from 'react-json-view';
import JSONtoTable from './JSONtoTable';
// import {useTable} from 'react-table';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const s3_bucket ='YOUR_BUCKET_NAME_HERE';
const region ='YOUR_DESIRED_REGION_HERE';

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_HERE',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY_HERE'
});

const myBucket = new AWS.S3({
  params: { Bucket: s3_bucket },
  region: region,
});

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [staticData,setStaticData] = useState([]);
  const [flaskResp,setFlaskResp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrcnt,setLoadingPrcnt] = useState(0);
  const [loadingPredPrice, setLoadingPredPrice] = useState(false);
  const [loadingPrcntPredPrice,setLoadingPrcntPredPrice] = useState(0);
  const [jsonToTableData, setJsonToTableData] = useState([]);

  // const secretKey = "secret_key";
  
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFileToS3Bucket = () => {
    if (selectedFile) {
      setLoading(true);
      const params = {
        ACL: 'public-read',
        Body: selectedFile,
        Bucket: s3_bucket,
        Key: selectedFile.name,
      };

      // myBucket.putObject(params)
      //   .on('httpUploadProgress', (event) => {
      //     setProgress(Math.round((event.loaded / event.total) * 100));
      //   })
      //   .send((error) => {
      //     if (error) console.log(error);
      //   });

      showImage();
      setSelectedFile(null);
      setLoading(false);

      // setTimeout(() => {
      // },5000);
    }
  };

  function showImage() {
    const imgURL = 'https://marketsworkshop.s3.amazonaws.com/mldata/dataplot.png';     // hardcoded image url
    
    let imageplot = document.getElementById("plot-image");
    imageplot.src = imgURL;
}

  const uploadFileToFlaskEndpoint = (event) => {
    // const formData = new FormData();
    // formData.append('file', selectedFlaskFile);

    // showStaticData();
    setLoadingPredPrice(true);

    fetch('http://127.0.0.1:5000/predict', {
      method: 'GET',
    })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
        text=JSON.parse(text);
        setFlaskResp(text);
        // console.log(text);
        setJsonToTableData(text.data);
        console.log(text.data);
        let res = document.getElementById("flask-resp");
        let resimg = document.getElementById("flask-resp-img");
        if(res.style.display === "none")
        {
          res.style.display = "flex";
          resimg.style.display = "flex";
        }
        else
        {
          res.style.display = "none";
          resimg.style.display = "none";
        }
        // console.log(text);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    // setTimeout(() => {

    // },5000);
    setLoadingPredPrice(false);
  };

  Papa.parse(staticDataCSVFile, {
    download: true,
    header: true,
    complete: (results) => {
      setStaticData(results.data);
    },
  });
    
  
  function showStaticData() {
    let table = document.getElementById("static-data-table");
    if (table.style.display === "none") {
      table.style.display = "table";
    } else {
      table.style.display = "none";
    }
  }




  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingPrcnt(prevLoading => {
        if (prevLoading === 100) {
          clearInterval(timer);
          return 0;
        } else {
          return prevLoading + 10;
        }
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingPrcntPredPrice(prevLoading => {
        if (prevLoading === 100) {
          clearInterval(timer);
          return 0;
        } else {
          return prevLoading + 10;
        }
      });
    }, 1000);
  }, []);


//   const columns = [
//     { Header: 'InstrumentId', accessor: 'instrumentId' },
//     { Header: 'Actual', accessor: 'actual' },
//     { Header: 'Predicted', accessor: 'predicted' },
//     { Header: 'Diff', accessor: 'diff' },
//   ];

// // const tablefromJSON = useTable({ columns, jsonToTableData });


  return (
    <div className='container'>
      <div style={{backgroundColor: "darkblue"}}>
        <h1 style={{textAlign: "center", color: "white"}}>Derivative Pricing</h1>
      </div>
      <div className='section1' style={{display: "flex", flexDirection: "column"}}>
        <div className="sec1headerwrapper" style={{display: "flex", flexDirection: "row",alignItems: "center"}}>
          <div>
            <h4 style={{paddingLeft: "10px"}}>TRAINED MODEL SUMMARY</h4>
          </div>
          <div style={{}}>
            <label htmlFor="file-upload">
              <Button component="span" style={{marginLeft: "5px"}}>
                Select File
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />

            <Button onClick={() => uploadFileToS3Bucket(selectedFile)} style={{marginLeft: "5px"}} variant="contained" color="primary" component="span">
              Train
            </Button>
          </div>
        </div>
        
        {/* <div>Uploading {progress}% ...</div>
        <div>
          <img id='plot-image' src='' alt=''>

          </img>
        </div> */}
        <div style={{alignSelf: "center"}}>
          {loading ? (
            <div className="progress-bar">
              <progress value={loadingPrcnt} max="100" />
              <span>{`${loadingPrcnt}%`}</span>
            </div>
          ) : (
            <img style={{width: "500px", margin: "10px"}} id='plot-image' src='' alt=''>

            </img>
          )}
        </div>
      </div>

      <div className='section2' style={{display: "flex", flexDirection: "column"}}>
        <div className='sec2headerwrapper' style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <h4 style={{paddingLeft: "10px"}}>TEST DATA FOR PRICE PREDICTION</h4>
          <div style={{margin: "10px"}}>
              <Button onClick={showStaticData} variant="contained" color="secondary">
                View Test Data
              </Button>
            </div>
          </div>
              <TableContainer component={Paper} style={{maxWidth: "99%", margin: "10px", overflowX: "auto"}}>
                <Table id="static-data-table" style={{display: "none"}} sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {staticData.length > 0 &&
                        Object.keys(staticData[0]).map((key) => <StyledTableCell key={key} style={{backgroundColor: "black", color: "white"}}>{key.toUpperCase()}</StyledTableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staticData.map((row, index) => ( 
                      <StyledTableRow key={index}>
                        {Object.values(row).map((value, index) => (
                          <StyledTableCell  key={index} style={{whiteSpace: "nowrap"}}>{value}</StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
        </div>

        <div className='section3'>
          <div className='sec3headerwrapper' style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

            <h4 style={{paddingLeft: "10px"}}>PREDICT PRICING WITH TEST DATA</h4>
            <div style={{margin: "10px"}}>            
              <Button onClick={() => uploadFileToFlaskEndpoint()} variant="contained" color="primary" component="span">
                Predict Price
              </Button>
            </div>
            </div>

          {loadingPredPrice ? (
            <div className="progress-bar">
              <progress value={loadingPrcntPredPrice} max="100" />
              <span>{`${loadingPrcntPredPrice}%`}</span>
            </div>
          ) : (
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "500px"}}>
              <div id='flask-resp' style={{display: "none"}}>

                <JSONtoTable data={jsonToTableData}/>
                {/* <ReactJson 
                  src={flaskResp} 
                  displayDataTypes={false} 
                  displayObjectSize={false} 
                  iconStyle="square" 
                  style={{ marginTop: "10px"}}
                /> */}
              </div>
              <div id='flask-resp-img' style={{display: "none", margin: "10px"}}>
                <img src='https://marketsworkshop.s3.amazonaws.com/mldata/dataplot.png' alt='' style={{width: "500px"}}></img>  {/* hardcoded image link */}
              </div>
            </div>
          )}
            
        </div>
        
        
        {/* <div style={{display: "flex", flexDirection: "column", overflowX: "auto"}}> */}
          
          {/* <div>
          {loading < 100 ? (
            <div className="progress-bar">
              <div className="progress" style={{ width: `${loading}%` }}></div>
            </div>
          ) : (
            <div id='flask-resp' style={{display: "none"}}>
              <ReactJson src={flaskResp} style={{ marginTop: "10px"}}/>
            </div>
          )}
        </div> */}

            
          {/* </div> */}
    </div>
  );
}

export default App;
