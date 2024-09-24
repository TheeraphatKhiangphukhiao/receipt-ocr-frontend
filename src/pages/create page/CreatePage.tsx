import { Button } from '@mui/material';
import './createpage.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from "react-router-dom";

export default function CreatePage() {

  //create hook
  const navigate = useNavigate(); // useNavigate hook


  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      //setImageName(file.name);
      //setSelectedImage(file);
      navigate("/edit", {
        state: {
          selectedImage: file
        }
      });
    }
  };



  return (
    <div className="CreatePage_body">
      <Button
        className="CreatePage_btn_import"
        sx={{
          borderRadius: '15px',
          border: '3px solid #317AC7',
          color: '#317AC7',
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 10,
          paddingRight: 10,
          textTransform: 'lowercase',
          fontFamily: 'Kanit',
        }}
        variant="outlined"
        component="label"
      >
        <AddPhotoAlternateIcon sx={{ width: 60, height: 60 }} />
        Import receipt image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFile}
        />
      </Button>
    </div>
  );
}
