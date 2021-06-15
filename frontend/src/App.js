import { useEffect, useRef, useState } from 'react';
import './App.css';
import {
  Button,
  ButtonGroup,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core';
import BoldIcon from '@material-ui/icons/FormatBoldSharp';
import UnderlineIcon from '@material-ui/icons/FormatUnderlinedSharp';
import UnorderedList from '@material-ui/icons/FormatListBulletedSharp';
import OrderedList from '@material-ui/icons/FormatListNumberedSharp';
import ItalicIcon from '@material-ui/icons/FormatItalicSharp';
import AlignLeftIcon from '@material-ui/icons/FormatAlignLeftSharp';
import AlignCenterIcon from '@material-ui/icons/FormatAlignCenterSharp';
import AlignRightIcon from '@material-ui/icons/FormatAlignRightSharp';
import JustifyIcon from '@material-ui/icons/FormatAlignJustifySharp';
import StrikethroughIcon from '@material-ui/icons/StrikethroughSSharp';
import ColorTextIcon from '@material-ui/icons/FormatColorTextSharp';
import { ChromePicker } from 'react-color';
import Loading from 'react-loading';
const { ipcRenderer } = window.require('electron');

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#2a2b2e',
    },
  },
});

const popover = {
  position: 'absolute',
  zIndex: '2',
  marginLeft: '80%',
};

const cover = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
};

function App() {
  const contentRef = useRef(null);
  const [corrections, setCorrections] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textColor, setTextColor] = useState('#000');

  const fetchCorrections = async () => {
    await (
      await fetch('http://localhost:3001/api/corrections', {
        method: 'POST',
        body: JSON.stringify({ text: contentRef.current.innerText }),
        headers: {
          'Content-type': 'application/json',
        },
      })
    )
      .json()
      .then((data) => setCorrections(data))
      .then(setTimeout(fetchCorrections, 1000));
  };

  useEffect(() => {
    ipcRenderer.on('open-file-data', (event, data) => {
      contentRef.current.innerHTML = data;
    });
    ipcRenderer.on('save-file-request', (event, newFile) => {
      ipcRenderer.send('save-file-contents', {
        content: contentRef.current.innerHTML,
        newFile,
      });
    });
    fetchCorrections();
  }, []);

  const execute = (cmd) => (e) => {
    e.preventDefault();
    contentRef.current.focus();
    document.execCommand(cmd, false, null);
  };

  const handleTabs = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&#009');
    }
  };

  const applyReplace = (val) => (e) => {
    e.preventDefault();
    const { [val]: value, ...valueRemoved } = corrections;
    setCorrections(valueRemoved);
    const regex = new RegExp(val, 'g');
    contentRef.current.innerHTML = contentRef.current.innerHTML.replace(
      regex,
      corrections[val]
    );
  };

  const toggleColorPicker = (e) => {
    e.preventDefault();
    setShowColorPicker(!showColorPicker);
  };

  const closeColorPicker = (e) => {
    e.preventDefault();
    setShowColorPicker(false);
  };

  const pickColor = (color, e) => {
    e.preventDefault();
    contentRef.current.focus();
    setTextColor(color.hex);
    document.execCommand('foreColor', false, color.hex);
  };

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <ButtonGroup color='primary' variant='contained'>
          <Button onMouseDown={execute('underline')}>
            <UnderlineIcon />
          </Button>
          <Button onMouseDown={execute('bold')}>
            <BoldIcon />
          </Button>
          <Button onMouseDown={execute('italic')}>
            <ItalicIcon />
          </Button>
          <Button onMouseDown={execute('insertUnorderedList')}>
            <UnorderedList />
          </Button>
          <Button onMouseDown={execute('insertOrderedList')}>
            <OrderedList />
          </Button>
          <Button onMouseDown={execute('justifyLeft')}>
            <AlignLeftIcon />
          </Button>
          <Button onMouseDown={execute('justifyCenter')}>
            <AlignCenterIcon />
          </Button>
          <Button onMouseDown={execute('justifyRight')}>
            <AlignRightIcon />
          </Button>
          <Button onMouseDown={execute('justifyFull')}>
            <JustifyIcon />
          </Button>
          <Button onMouseDown={execute('strikeThrough')}>
            <StrikethroughIcon />
          </Button>
          <Button onClick={toggleColorPicker}>
            <ColorTextIcon />
          </Button>
        </ButtonGroup>

        {showColorPicker ? (
          <div style={popover}>
            <div style={cover} onClick={closeColorPicker} />
            <ChromePicker
              className='colorPicker'
              onChange={pickColor}
              color={textColor}
            />
          </div>
        ) : null}

        <div className='centerScreen'>
          <div
            spellCheck='false'
            className='content'
            contentEditable='true'
            ref={contentRef}
            onKeyDown={handleTabs}></div>
          <div className='correctionsArea'>
            <div>Correction Suggestions</div>
            <div>
              {corrections == null
                ? ''
                : Object.keys(corrections).map((entry) => {
                    return (
                      <Button
                        onClick={applyReplace(entry)}
                        key={entry}
                        style={{
                          border: '1px solid white',
                          marginTop: '20px',
                        }}>
                        {entry} - {corrections[entry]}
                      </Button>
                    );
                  })}
              <div className='Loading'>
                <Loading
                  type='spinningBubbles'
                  color='white'
                  height={50}
                  width={40}
                />
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
