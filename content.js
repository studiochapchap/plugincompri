const sidebar = document.createElement('iframe');
sidebar.src = chrome.runtime.getURL('sidebar.html');
sidebar.style.position = 'fixed';
sidebar.style.top = '0';
sidebar.style.right = '0';
sidebar.style.width = '300px';
sidebar.style.height = '100vh';
sidebar.style.border = 'none';
sidebar.style.zIndex = '9999';
sidebar.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.2)';
document.body.appendChild(sidebar);
if (!document.getElementById('claris-sidebar')) {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('sidebar.html');
    iframe.id = 'claris-sidebar';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.width = '25%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '100000';
    iframe.style.boxShadow = '-4px 0 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(iframe);
  }

  
  
  
  
  
  
  
  
  