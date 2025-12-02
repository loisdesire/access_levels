// Custom Modal Functions

// Create modal HTML if it doesn't exist
function ensureModalExists() {
    if (!document.getElementById('customModal')) {
        const modalHTML = `
            <div id="customModal" class="custom-modal">
                <div class="custom-modal-content">
                    <div class="custom-modal-header">
                        <h3 id="modalTitle">Confirm</h3>
                    </div>
                    <div class="custom-modal-body">
                        <p id="modalMessage"></p>
                    </div>
                    <div class="custom-modal-footer">
                        <button class="modal-btn modal-btn-cancel" id="modalCancel">Cancel</button>
                        <button class="modal-btn modal-btn-confirm" id="modalConfirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// Custom confirm dialog
function customConfirm(message, title = 'Confirm Action', isDanger = false) {
    return new Promise((resolve) => {
        ensureModalExists();
        
        const modal = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        // Style the confirm button based on action type
        if (isDanger) {
            modalConfirm.className = 'modal-btn modal-btn-danger';
            modalConfirm.textContent = 'Delete';
        } else {
            modalConfirm.className = 'modal-btn modal-btn-confirm';
            modalConfirm.textContent = 'Confirm';
        }
        
        modal.style.display = 'block';
        
        const handleConfirm = () => {
            modal.style.display = 'none';
            resolve(true);
        };
        
        const handleCancel = () => {
            modal.style.display = 'none';
            resolve(false);
        };
        
        modalConfirm.onclick = handleConfirm;
        modalCancel.onclick = handleCancel;
        
        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) handleCancel();
        };
    });
}

// Custom alert dialog
function customAlert(message, title = 'Notice') {
    return new Promise((resolve) => {
        ensureModalExists();
        
        const modal = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        // Hide cancel button for alerts
        modalCancel.style.display = 'none';
        modalConfirm.className = 'modal-btn modal-btn-confirm';
        modalConfirm.textContent = 'OK';
        
        modal.style.display = 'block';
        
        const handleOK = () => {
            modal.style.display = 'none';
            modalCancel.style.display = 'block'; // Restore for future use
            resolve(true);
        };
        
        modalConfirm.onclick = handleOK;
        
        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) handleOK();
        };
    });
}

// Custom form dialog (for multiple fields)
function customForm(fields, title = 'Edit', description = '') {
    return new Promise((resolve) => {
        // Create form modal if it doesn't exist
        if (!document.getElementById('customFormModal')) {
            const modalHTML = `
                <div id="customFormModal" class="custom-modal">
                    <div class="custom-modal-content custom-modal-large">
                        <div class="custom-modal-header">
                            <h3 id="formModalTitle">Edit</h3>
                            <p id="formModalDescription" style="margin: 8px 0 0 0; font-size: 14px; color: #666; font-weight: normal;"></p>
                        </div>
                        <div class="custom-modal-body">
                            <div id="formModalFields"></div>
                        </div>
                        <div class="custom-modal-footer">
                            <button class="modal-btn modal-btn-cancel" id="formModalCancel">Cancel</button>
                            <button class="modal-btn modal-btn-confirm" id="formModalConfirm">Save</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        const modal = document.getElementById('customFormModal');
        const modalTitle = document.getElementById('formModalTitle');
        const modalDescription = document.getElementById('formModalDescription');
        const modalFields = document.getElementById('formModalFields');
        const modalCancel = document.getElementById('formModalCancel');
        const modalConfirm = document.getElementById('formModalConfirm');
        
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalDescription.style.display = description ? 'block' : 'none';
        
        // Build form fields
        let fieldsHTML = '';
        fields.forEach((field, index) => {
            const fieldType = field.type || 'text';
            const fieldId = `formField${index}`;
            const placeholder = field.placeholder || '';
            
            if (fieldType === 'textarea') {
                fieldsHTML += `
                    <div class="modal-form-group">
                        <label class="modal-label">${field.label}</label>
                        <textarea id="${fieldId}" class="modal-textarea" rows="${field.rows || 4}" placeholder="${placeholder}">${field.value || ''}</textarea>
                    </div>
                `;
            } else {
                fieldsHTML += `
                    <div class="modal-form-group">
                        <label class="modal-label">${field.label}</label>
                        <input type="${fieldType}" id="${fieldId}" class="modal-input" value="${field.value || ''}" placeholder="${placeholder}" />
                    </div>
                `;
            }
        });
        
        modalFields.innerHTML = fieldsHTML;
        modal.style.display = 'block';
        
        // Focus first field
        const firstField = document.getElementById('formField0');
        if (firstField) {
            firstField.focus();
            if (firstField.tagName === 'INPUT') firstField.select();
        }
        
        const handleConfirm = () => {
            const values = {};
            fields.forEach((field, index) => {
                const input = document.getElementById(`formField${index}`);
                values[field.name] = input.value;
            });
            modal.style.display = 'none';
            resolve(values);
        };
        
        const handleCancel = () => {
            modal.style.display = 'none';
            resolve(null);
        };
        
        modalConfirm.onclick = handleConfirm;
        modalCancel.onclick = handleCancel;
        
        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) handleCancel();
        };
    });
}
