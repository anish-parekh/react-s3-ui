import { React, useState } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import AWS from 'aws-sdk';
import Papa from 'papaparse';


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
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFlaskFile,setSelectedFlaskFile] = useState(null);
  const [staticData,setStaticData] = useState([]);
  const [flaskResp,setFlaskResp] = useState([]);

  const secretKey = "secret_key";
  
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFileToS3Bucket = () => {
    if (selectedFile) {
      const params = {
        ACL: 'public-read',
        Body: selectedFile,
        Bucket: s3_bucket,
        Key: selectedFile.name,
      };

      myBucket.putObject(params)
        .on('httpUploadProgress', (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        })
        .send((error) => {
          if (error) console.log(error);
        });

      setSelectedFile(null);
    }
  };


  const handleFlaskFileInput = (e) => {
    setSelectedFlaskFile(e.target.files[0]);
  };


  const uploadFileToFlaskEndpoint = (event) => {
    const formData = new FormData();
    formData.append('file', selectedFlaskFile);

    fetch('http://127.0.0.1:5000/endpoint', {
      method: 'POST',
      headers: {
        'SECRET_KEY': {secretKey},
      },    
      body: formData,
    })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
        text=JSON.parse(text);
        setFlaskResp(JSON.stringify(text,null,2));
        let res = document.getElementById("flask-resp");
        if(res.style.display === "none")
        {
          res.style.display = "inline";
        }
        else
        {
          res.style.display = "none";
        }
        console.log(text);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  };

  const staticDataHandleUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setStaticData(results.data);
      },
    });
  };
  
  function showStaticData() {
    let table = document.getElementById("static-data-table");
    if (table.style.display === "none") {
      table.style.display = "table";
    } else {
      table.style.display = "none";
    }
  }

  return (
    <div className='container'>
      <div className='section1'>
        <label htmlFor="file-upload">
          <Button component="span">
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

          <Button onClick={() => uploadFileToS3Bucket(selectedFile)} variant="contained" color="primary" component="span">
            Train
          </Button>

        <div>Uploading {progress}% ...</div>
      </div>

      <div className='section2'>
        <div>
        <label htmlFor="static-data-file-upload">
            <Button component="span">
              Select File
            </Button>
        </label>
        <input 
          id="static-data-file-upload"
          accept='.csv'
          type="file" 
          style={{ display: 'none' }}
          onChange={staticDataHandleUpload} 
        />

        <Button onClick={showStaticData} variant="contained" color="secondary">
          Test
        </Button>
          <table id="static-data-table" style={{display: "none"}}>
            <thead>
              <tr>
                {staticData.length > 0 &&
                  Object.keys(staticData[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {staticData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        
        </div>

        <label htmlFor="file-upload-to-flask">
            <Button component="span">
              Select File
            </Button>
        </label>
          <input
            id="file-upload-to-flask"
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFlaskFileInput}
          />

            <Button onClick={() => uploadFileToFlaskEndpoint(selectedFlaskFile)} variant="contained" color="primary" component="span">
              Process Data
            </Button>

            <div id='flask-resp' style={{display: "none"}}>
              <pre>{flaskResp}</pre>
            </div>

      </div>
      
    </div>
  );
}

export default App;
