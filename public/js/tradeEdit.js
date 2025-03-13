// Trade editing functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Trade edit script loaded');
  
  // Get modal elements
  const editModal = document.getElementById('editTradeModal');
  const editForm = document.getElementById('editTradeForm');
  const saveButton = document.getElementById('saveTradeChanges');
  const closeButtons = document.querySelectorAll('.close, .close-modal');
  
  // Form fields
  const tradeIdInput = document.getElementById('editTradeId');
  const tickerInput = document.getElementById('editTicker');
  const quantityInput = document.getElementById('editQuantity');
  const priceInput = document.getElementById('editPrice');
  const dateInput = document.getElementById('editDate');
  
  // Function to set up edit button listeners
  function setupEditButtons() {
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-trade-btn').forEach(button => {
      button.addEventListener('click', function() {
        const tradeId = this.getAttribute('data-id');
        const ticker = this.getAttribute('data-ticker');
        const quantity = this.getAttribute('data-quantity');
        const price = this.getAttribute('data-price');
        const date = this.getAttribute('data-date');
        
        console.log(`Editing trade: ${ticker}, ID: ${tradeId}`);
        
        // Populate form
        tradeIdInput.value = tradeId;
        tickerInput.value = ticker;
        quantityInput.value = quantity;
        priceInput.value = price;
        dateInput.value = formatDateForInput(date);
        
        // Show modal
        editModal.style.display = 'block';
      });
    });
  }
  
  // Initial setup of edit buttons
  setupEditButtons();
  
  // Set up a MutationObserver to watch for new trades being added
  const tradesTableBody = document.querySelector('#trades-table tbody');
  if (tradesTableBody) {
    const observer = new MutationObserver(function(mutations) {
      setupEditButtons();
    });
    
    observer.observe(tradesTableBody, { childList: true });
  }
  
  // Close modal when clicking close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      editModal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
  });
  
  // Handle save button click
  if (saveButton) {
    saveButton.addEventListener('click', async function() {
      if (!editForm.checkValidity()) {
        editForm.reportValidity();
        return;
      }
      
      const tradeId = tradeIdInput.value;
      const updatedTrade = {
        ticker: tickerInput.value.toUpperCase(),
        quantity: parseFloat(quantityInput.value),
        purchasePrice: parseFloat(priceInput.value),
        purchaseDate: dateInput.value
      };
      
      console.log(`Submitting updated trade: ${JSON.stringify(updatedTrade)}`);
      
      try {
        const response = await fetch(`/api/trades/${tradeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedTrade)
        });
        
        if (response.ok) {
          // Close modal and refresh data
          editModal.style.display = 'none';
          
          // Refresh the trades data
          if (typeof loadTrades === 'function') {
            loadTrades();
          } else {
            // If loadTrades isn't available, just reload the page
            window.location.reload();
          }
        } else {
          const errorData = await response.json();
          alert(`Error updating trade: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating trade:', error);
        alert('Failed to update trade. Please try again.');
      }
    });
  }
  
  // Helper function to format date for input field (YYYY-MM-DD)
  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}); 