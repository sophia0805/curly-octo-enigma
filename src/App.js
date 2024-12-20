import {useState} from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import FileDisplay from './components/files/FileDisplay.js';
import './styles/FileDisplay.css'
import { FileManagerProvider } from './components/FileManagerContext';

function App() {
  //i gave up with login
  const [user, setUser] = useState({
    displayName: "Sophia is so cool",
    email: "idkwhattoputhere@gmail.com",
    emailVerified: true,
    phoneNumber: null,
    photoURL: "https://lh6.googleusercontent.com/-KyLTWqvDIHQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclcWGWqkt6YUAan32YO4CSR07Y2jw/s96-c/photo.jpg"
  })

  return (
    <FileManagerProvider>
       <div className="App">
        <Header userPhoto={user.photoURL}/>
        <Sidebar/>
        <main className="app__main">
          <FileDisplay />
        </main>
      </div>
    </FileManagerProvider>
  );
}

export default App;
