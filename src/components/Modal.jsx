import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const MyVerticallyCenteredModal = (props) => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    props.setImageLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    console.log(formData)

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        const response = await axios.post(`https://thai-card.onrender.com/upload`, formData, config);   
        console.log('Response:', response);

        const { identification_number, name, last_name, date_of_birth, date_of_issue, date_of_expiry } = response.data;
        props.setIdNumber(identification_number);
        props.setName(name);
        props.setLastName(last_name);
        props.setDOB(date_of_birth);
        props.setDOI(date_of_issue);
        props.setDOE(date_of_expiry);
        props.setIsImageUploaded(true);
        console.log(name)
        console.log(last_name)
        props.setImageLoading(false);
        props.setIsImageUploaded(true);

    } catch (error) {
       
        console.error('Error uploading image:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
    }
};

  const handleUpload = () => {
    if (!file) {
      props.setError("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const isImage = reader.result && reader.result.startsWith("data:image");
      
      if (!isImage) {
        props.setError("Please upload a valid image file.");
        props.onHide();
        return;
      }
      
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        props.setError("Supported formats: JPEG, JPG ,PNG.");
        props.onHide();
        return;
      }
  
      if (file.size > 2 * 1024 * 1024) {
        props.setError(" Size is larger than 2MB, Maximum file size allowed is : 2MB.");
        props.onHide();
        return;
      }
      props.setImage(URL.createObjectURL(file));
      props.setIsImageUploaded(true);
      props.setError(null);
      setFile(null);
      props.onHide();
    };
    reader.readAsDataURL(file);
  };
  
   
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload Image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-3"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyVerticallyCenteredModal;
