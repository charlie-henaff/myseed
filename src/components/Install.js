import { Button } from '@mui/material';
import React from 'react';
import PWAInstallerPrompt from 'react-pwa-installer-prompt';

const Install = () => {       
  return (  
    <PWAInstallerPrompt 
      render={({ onClick }) => (
        <div align="middle" justify="center">
            <Button onClick={onClick}>
              Install
            </Button>
        </div>
      )}
      callback={(data) => console.log(data)} 
    />
  )
}

export default Install;