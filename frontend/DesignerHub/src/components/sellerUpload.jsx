// import { useState } from 'react';
// import axios from 'axios';

// function FileUpload() {
//   const [file, setFile] = useState(null);
//   const [uploadedUrl, setUploadedUrl] = useState('');

//   const handleChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return alert('Please select a file');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const res = await axios.post('http://localhost:8000/api/products', formData);
//       setUploadedUrl(res.data.fileUrl);
//     } catch (err) {
//       alert('Upload failed');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-4">
//       <input type="file" onChange={handleChange} />
//       <button onClick={handleUpload} className="ml-2 px-4 py-1 bg-blue-500 text-white rounded">Upload</button>

//       {uploadedUrl && (
//         <div className="mt-4">
//           <p>Uploaded File:</p>
//           {uploadedUrl.match(/\.(jpeg|jpg|png)$/) ? (
//             <img src={uploadedUrl} alt="Uploaded" className="w-40 mt-2" />
//           ) : (
//             <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">View File</a>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default FileUpload;
