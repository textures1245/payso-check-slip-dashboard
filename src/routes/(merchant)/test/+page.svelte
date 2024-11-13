<!-- App.svelte -->
<script lang='ts'>
    import { writable } from 'svelte/store';
    import PackageCard from './(components)/PackageCards.svelte';
    import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	
	import { onMount } from 'svelte';
	let packages: any[] = [];
	let maxIndex ='';
	let loading = false;
	let randomNumber =0;

	onMount(async () => {
		clearRemainingTime()
		try {
			const datas = await GetPackage();
			// Use profileData here
			packages = datas.result;
			maxIndex = datas.result.length;
            const maxQuotaLimit = Math.max(...packages.map(pkg => pkg.OrderAmount));
			randomNumber = maxQuotaLimit;
            
		} catch (error) {
			console.error('Error fetching profile:', error);
		}


	});
	const GetPackage = async () => {
		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
                'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true',
            }
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/package/packageactive`, config);
		const data = await result.json();
		return data
	};

	
function clearRemainingTime() {
    localStorage.removeItem('remainingTime'); // การใช้งานที่ถูกต้อง
	localStorage.removeItem('Img');
	localStorage.removeItem('RefNo');
	localStorage.setItem('timerCleared', 'true');
    if ((window as any).intervalId) {
    clearInterval((window as any).intervalId);
    console.log('Timer stopped.');
  }
  
}
    // Store สำหรับเก็บข้อมูลฟอร์ม
    const formData = writable({
      // Basic Details
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      
      // Contact Details
      email: '',
      phone: '',
      address: '',
      city: '',
      
      // Verification
      idCard: null,
      selfie: null
    });
  
    // Store สำหรับเก็บสถานะ steps
    const steps = writable([
      {
        label: 'Basic Details',
        completed: false,
        active: true,
        subSteps: [
          { label: 'Personal Info', completed: false },
          { label: 'Account Setup', completed: false }
        ]
      },
      {
        label: 'Contact Details',
        completed: false,
        active: false,
        subSteps: [
          { label: 'Email & Phone', completed: false },
          { label: 'Address Info', completed: false }
        ]
      },
      {
        label: 'Verification',
        completed: false,
        active: false,
        subSteps: [
          { label: 'ID Upload', completed: false },
          { label: 'Face Verification', completed: false }
        ]
      },
      {
        label: 'Completed',
        completed: false,
        active: false,
        subSteps: []
      }
    ]);
  
    let currentStep = 0;
    let currentSubStep = 0;
  
    // ตรวจสอบการกรอกข้อมูล Basic Details
    function validateBasicDetails(section) {
      if (section === 'personal') {
        return $formData.firstName && $formData.lastName;
      }
      return $formData.username && $formData.password;
    }
  
    // ตรวจสอบการกรอกข้อมูล Contact Details
    function validateContactDetails(section) {
      if (section === 'contact') {
        return $formData.email && $formData.phone;
      }
      return $formData.address && $formData.city;
    }
  
    // ตรวจสอบการอัพโหลดเอกสาร
    function validateVerification(section) {
      if (section === 'id') {
        return $formData.idCard;
      }
      return $formData.selfie;
    }
  
    // อัพเดทสถานะ step
    function updateStepStatus() {
      $steps = $steps.map((step, index) => {
        if (index === currentStep) {
          const updatedSubSteps = step.subSteps.map((subStep, subIndex) => ({
            ...subStep,
            completed: subIndex === currentSubStep ? true : subStep.completed
          }));
          
          const allSubStepsCompleted = updatedSubSteps.every(sub => sub.completed);
          
          return {
            ...step,
            subSteps: updatedSubSteps,
            completed: allSubStepsCompleted
          };
        }
        return step;
      });
    }
  
    // ไปยังขั้นตอนถัดไป
    function goToNextStep() {
      if (currentSubStep < $steps[currentStep].subSteps.length - 1) {
        currentSubStep++;
      } else if (currentStep < $steps.length - 1) {
        currentStep++;
        currentSubStep = 0;
        
        // อัพเดทสถานะ active
        $steps = $steps.map((step, index) => ({
          ...step,
          active: index === currentStep
        }));
      }
    }
  
    // จัดการการ submit form
    function handleSubmit() {
      let isValid = false;
  
      switch(currentStep) {
        case 0: // Basic Details
          isValid = validateBasicDetails(currentSubStep === 0 ? 'personal' : 'account');
          break;
        case 1: // Contact Details
          isValid = validateContactDetails(currentSubStep === 0 ? 'contact' : 'address');
          break;
        case 2: // Verification
          isValid = validateVerification(currentSubStep === 0 ? 'id' : 'face');
          break;
      }
  
      if (isValid) {
        updateStepStatus();
        goToNextStep();
      }
    }
  </script>

  <div class=" mx-auto p-6 bg-primary-foreground">
    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="w-full px-5 py-4">
        <div class="flex justify-between items-center relative">
          {#each $steps as step, i}
            <div class="flex items-center flex-1">
              <!-- Circle with Progress -->
              <div class="relative">
                <div 
                  class={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    border-2 font-semibold text-sm z-10
                    ${step.completed ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-600'}
                    ${step.active ? 'border-blue-500 text-blue-500' : ''}
                  `}
                >
                  {#if step.completed}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  {:else}
                    {i + 1}
                  {/if}
                </div>
                
                <!-- Progress Circle -->
                {#if step.subSteps.length > 0 && !step.completed && step.subSteps.some(sub => sub.completed)}
                  <svg class="absolute top-0 left-0 -rotate-90" width="32" height="32">
                    <circle
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      r="14"
                      cx="16"
                      cy="16"
                      class="text-blue-500"
                      style="stroke-dasharray: {2 * Math.PI * 14}; stroke-dashoffset: {2 * Math.PI * 14 * (1 - (step.subSteps.filter(sub => sub.completed).length / step.subSteps.length))}"
                    />
                  </svg>
                {/if}
              </div>
  
              <!-- Label and SubSteps -->
              <div class="ml-2">
                <span class="text-sm text-gray-600 font-medium">
                  {step.label}
                </span>
                
                {#if step.subSteps.length > 0}
                  <div class="flex flex-col gap-0.5 mt-1">
                    {#each step.subSteps as subStep}
                      <div class="flex items-center text-xs text-gray-500 gap-1">
                        <div class={`w-1 h-1 rounded-full ${subStep.completed ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        {subStep.label}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
  
              <!-- Connecting Line -->
              {#if i < $steps.length - 1}
                <div class={`
                  flex-1 h-0.5 mx-4
                  ${step.completed ? 'bg-blue-500' : 'bg-gray-300'}
                `}></div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  
    <!-- Form Content -->
    <div class="bg-white rounded-lg shadow-sm border  min-w-6xl border-gray-200">
      {#if currentStep === 0}
        <!-- Basic Details -->
        {#if currentSubStep === 0}
        <div class="flex flex-col min-h-[calc(100vh-41px)]">
            <div class="sm:text-center flex justify-center text-4xl mt-8 mb-4  font-bold">
                <h1 class=" text-wrap text-center text-black">ราคาแพ็คเกจ</h1>
                
            </div>
            <div class="text-center mx-5 mb-4"><h5>เพิ่มความสะดวกสบายและประหยัดเวลาด้วยบริการตรวจสอบสลิปธนาคารของเรา เลือกแพ็คเกจที่เหมาะกับคุณ</h5></div>
            <div class="flex gap-2 flex-wrap justify-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-10 ">
                {#each packages as pkg,i}
                {#if pkg.OrderAmount != pkg.AmountLimit || pkg.AmountLimit==0  }
                    <div class=" lg:my-3 md:my-3 sm:my-2 my-3 lg:mx-2 md:mx-2 sm:mx-0 mx-0 transition-transform hover:scale-105 drop-shadow-lg" >
                        <PackageCard pkg={pkg} maxIndex={randomNumber} index={i}  />
                    </div>
                    {/if}
                {/each}
            </div>
        </div>
        {:else}
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Account Setup</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  bind:value={$formData.username}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  bind:value={$formData.password}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        {/if}
  
      {:else if currentStep === 1}
        <!-- Contact Details -->
        {#if currentSubStep === 0}
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Contact Information</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  bind:value={$formData.email}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  bind:value={$formData.phone}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        {:else}
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Address Information</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  bind:value={$formData.address}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  type="text" 
                  bind:value={$formData.city}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        {/if}
  
      {:else if currentStep === 2}
        <!-- Verification -->
        {#if currentSubStep === 0}
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">ID Verification</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Upload ID Card</label>
              <input 
                type="file" 
                accept="image/*"
                on:change={(e) => $formData.idCard = e.target.files[0]}
                class="w-full"
              />
            </div>
          </div>
        {:else}
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Face Verification</h2>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Upload Selfie</label>
              <input 
                type="file" 
                accept="image/*"
                on:change={(e) => $formData.selfie = e.target.files[0]}
                class="w-full"
              />
            </div>
          </div>
        {/if}
  
      {:else}
        <!-- Completed -->
        <div class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-semibold mb-2">Registration Completed!</h2>
          <p class="text-gray-600">Thank you for registering with us.</p>
        </div>
      {/if}
  
      <!-- Form Controls -->
      {#if currentStep < 3}
        <div class="mt-6 flex justify-end">
          <button
            on:click={handleSubmit}
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {currentStep === 2 && currentSubStep === 1 ? 'Complete Registration' : 'Continue'}
          </button>
        </div>
      {/if}
    </div>
  </div>