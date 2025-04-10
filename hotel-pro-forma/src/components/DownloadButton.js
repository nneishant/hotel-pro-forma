import React, { useState, useRef, useEffect } from 'react';
import { FaDownload, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import './DownloadButton.css';

const DownloadButton = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format) => {
    if (format === 'excel') {
      exportToExcel(data);
    } else if (format === 'pdf') {
      exportToPDF(data);
    }
    setIsOpen(false);
  };

  return (
    <div className="download-container" ref={dropdownRef}>
      <button 
        className="download-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaDownload />
        <span>Download Summary</span>
      </button>
      
      {isOpen && (
        <div className="download-dropdown">
          <button 
            className="download-option"
            onClick={() => handleExport('excel')}
          >
            <FaFileExcel />
            <span>Export as Excel</span>
          </button>
          <button 
            className="download-option"
            onClick={() => handleExport('pdf')}
          >
            <FaFilePdf />
            <span>Export as PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadButton; 