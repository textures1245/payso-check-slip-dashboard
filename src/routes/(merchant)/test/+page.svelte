<script>
    // กำหนดค่าเริ่มต้นให้กับ isChecked
    let isChecked = true; // ตั้งค่าเริ่มต้นให้เชื่อมต่อ (checked)
  
    // ฟังก์ชันสำหรับการอัปเดตการเชื่อมต่อธนาคาร
    function UpdateBankLink(value) {
      // แสดงค่าที่ได้จากการเช็ค
      console.log('Update bank link value:', value);
      console.log('Checkbox value:', isChecked);
      
      // ที่นี่คุณสามารถเพิ่มโค้ดเพื่อจัดการกับการเชื่อมต่อธนาคาร
    }
  
    // ฟังก์ชันเพื่อเปลี่ยนสถานะ
    function handleCheckboxChange(event) {
      isChecked = event.target.checked; // อัปเดตสถานะตาม checkbox
      UpdateBankLink(isChecked ? 1 : 0); // ส่งค่า 1 หรือ 0
    }
  </script>
  
  <div>
    <!-- ปุ่มสไลด์เปิดปิด -->
    <input
      type="checkbox"
      value="synthwave"
      class="toggle theme-controller"
      id="menuToggle"
      checked={isChecked}  
      on:click={handleCheckboxChange}
    />
    <label for="menuToggle" class="toggle-label">
      {isChecked ? 'เชื่อมต่อ' : 'ยกเลิกการเชื่อมต่อ'}
    </label>
  </div>
  