function doPost(e) {
  Logger.log("doPost called");
  
  try {
    // Log the entire request for debugging
    Logger.log("Request contents: " + JSON.stringify(e));
    
    // Get the request data
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
      Logger.log("Parsed data: " + JSON.stringify(data));
    } else {
      Logger.log("No postData found in request");
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: "No data received"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the Google Sheet
    const sheetId = '1h4W9Z7aE8_p_Qmsc_MhtIPGzHvMM69MIRgOo7wcOWdQ';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // Create timestamp
    const timestamp = new Date();
    
    // Append the data to the sheet
    // Order: Timestamp, Name, Mobile, Gender, Class, Message
    const rowData = [
      timestamp,
      data.name || '',
      data.mobile || '',
      data.gender || '',
      data.class || '',
      data.message || ''
    ];
    
    Logger.log("Adding row data: " + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    
    Logger.log("Data successfully added to sheet");
    
    // Return success response
    const output = ContentService.createTextOutput(JSON.stringify({success: true, message: "Data saved successfully"}));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
      
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    
    const errorOutput = ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}));
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    return errorOutput;
  }
}

function doOptions(e) {
  Logger.log("doOptions called for CORS preflight");
  
  return ContentService.createTextOutput("");
}

function doGet(e) {
  Logger.log("doGet called");
  
  // Return a friendly message for anyone visiting the URL directly
  const htmlOutput = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AFS Eid Card - Google Sheets API</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; }
          .success { color: #4CAF50; }
          .info { color: #2196F3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">✅ AFS Eid Card API</h1>
          <p class="info">This endpoint is working correctly!</p>
          <p>This API is designed to receive POST requests from the AFS Eid Card application.</p>
          <p>If you're seeing this message, it means the web app is properly deployed and accessible.</p>
          <hr>
          <small>© 2025 ACS Future School. All rights reserved.</small>
        </div>
      </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(htmlOutput);
} 