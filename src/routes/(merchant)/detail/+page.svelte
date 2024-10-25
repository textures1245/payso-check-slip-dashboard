<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import profile from '$lib/image/profile.png';
    import packages from '$lib/image/package.png';
    import packagess from '$lib/image/packages.png';
    import LineOA from '$lib/image/LineOA.jpg';
    import Login from '$lib/image/Login.png';
    import Logins from '$lib/image/logins.png';
    import Slip from '$lib/image/Slip.png';
    import addGroup from '$lib/image/addGroup.png';
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    
</script>


<div class="flex flex-col items-center justify-center xl:min-h-[calc(100vh-50px)]  p-6  bg-primary-foreground">
    <!-- Title Section -->
    <div class="text-center mb-6">
        <h1 class="text-4xl font-bold mb-2">เริ่มต้นใช้งานระบบของเรา</h1>
    </div>

        <div class="flex justify-center">
          
        
        <Carousel.Root class="bg-primary-foreground ">
            <Carousel.Content class=" max-w-3xl">
                <Carousel.Item class="flex justify-center"><div class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
                    <div class="text-sm">
                        <h2 class="text-2xl font-semibold mb-5">ขั้นตอนที่ 1: เชื่อมต่อ Line OA</h2>
                        <img src={LineOA} alt="Line OA" height="50%" width="180px" class="mx-auto mb-4">
                        <p class="text-gray-600 mt-8">กดที่เมนู "Register" เพื่อเริ่มต้นลงทะเบียน ถ้าคุณใช้คอมพิวเตอร์ ให้พิมพ์คำว่า "menu"</p>
                    </div>
                </div></Carousel.Item>
              <Carousel.Item class="flex justify-center"><div class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
                <div class="text-sm">
                    <h2 class="text-2xl font-semibold mb-2">ขั้นตอนที่ 2: เข้าสู่ระบบ</h2>
                    <img src={Login} alt="Login Options" height="50%" width="800px" class="mx-auto mb-4 lg:block sm:block hidden mt-5">
                    <img src={Logins} alt="Login Options Mobile" height="50%" width="800px" class="mx-auto mb-4 lg:hidden sm:hidden block mt-5">
                    <p class="text-gray-600 mt-8">เลือกบัญชีที่ต้องการใช้เข้าสู่ระบบ เช่น Facebook, Google, หรือ Line</p>
                </div>
            </div></Carousel.Item>
              <Carousel.Item class="flex justify-center"><div class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
                <div class="text-sm">
                    <h2 class="text-2xl font-semibold mb-5">ขั้นตอนที่ 3: เชื่อมต่อบัญชี Line</h2>
                    <div class="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                        <div class=""> <img src={profile} alt="Profile" height="20%" width="220px" class="mx-auto mb-4"></div>
                        <div><p class="text-gray-600">คุณสามารถเชื่อมต่อหลายบัญชี Line ได้ ทำตามขั้นตอนด้านล่าง:</p>
                            <ul class="list-disc list-inside text-gray-600">
                                <li>คลิกปุ่ม "Login With Line" เพื่อเชื่อมต่อบัญชี</li>
                                <li>หลังจากเชื่อมต่อบัญชี จะเห็นบัญชีที่เชื่อมต่อในรายการ</li>
                                <li>ถ้าอยากเชื่อมต่อบัญชีเพิ่ม ให้คลิก "Login With Line" อีกครั้ง</li>
                            </ul>
                            <p class="text-gray-600 my-2">หากต้องการยกเลิกการเชื่อมต่อ ให้คลิกเมนูข้างหลังชื่อบัญชีที่ต้องการยกเลิก</p>
                            <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <a href="/profile">ไปหน้าการเชื่อมต่อ Line</a>
                            </button></div>
                    </div>
                   
                </div>
            </div></Carousel.Item>
              <Carousel.Item class="flex justify-center "> <div class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
                <div class="text-sm">
                    <h2 class="text-2xl font-semibold mb-2">ขั้นตอนที่ 4: เลือกแพ็คเกจ</h2>
                    <p class="text-gray-600 my-2">เลือกแพ็คเกจที่เหมาะกับคุณเพื่อเริ่มใช้งาน Check Slip</p>
                    <div class="flex justify-center">
                    <img src={packages} alt="Package Options" class="w-full h-auto object-cover lg:hidden sm:hidden block my-3" style="max-width: 600px;">
                    <img src={packages} alt="Package Options Large" class="w-full h-auto object-cover lg:block sm:block hidden my-3" style="width: 500px;">
                </div>
                    <p class="text-gray-600 my-3">เมื่อเลือกแพ็คเกจแล้ว กดปุ่ม "Buy Now" จะมี QR Code ให้สแกนชำระเงิน</p>
                </div>
                <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <a href="/package">ไปหน้าการเลือกแพ็คเกจ</a>
                </button>
            </div></Carousel.Item>
              <Carousel.Item class="flex justify-center"><div class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
                <div class="text-sm">
                    <h2 class="text-2xl font-semibold mb-5">ขั้นตอนที่ 5: เพิ่มบอทในกลุ่ม Line</h2>
                    <div class="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                        <div class="flex justify-center">
                            <img src={addGroup} alt="Add Bot to Group" width="250px">
                        </div>
                        <div>
                            <div class="text-gray-600 mt-5">
                                <strong class="text-lg"> สร้างกลุ่มและเชิญบอท</strong>
                                <ul class="list-disc ml-5 text-sm">
                                    <li>หลังจากซื้อแพ็คเกจแล้ว ให้สร้างกลุ่ม Line เพื่อใช้ตรวจสอบสลิป</li>
                                    <li>คลิก "สร้างกลุ่ม" เพื่อสร้างกลุ่มใหม่</li>
                                    <li>เลือก "เชิญเพื่อน" และเพิ่ม Line OA Check Slip เข้ากลุ่ม</li>
                                    <li>เชิญเพื่อนคนอื่นที่ต้องการใช้บริการด้วยได้</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div></Carousel.Item>
              <Carousel.Item class="flex justify-center"><div class="w-full max-w-sm sm:max-w-xl lg:max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
                <div class="text-sm">
                    <h2 class="text-2xl font-semibold mb-5">ขั้นตอนที่ 6: การตรวจสอบสลิป</h2>
                    <div class="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                        <div class="flex justify-center">
                            <img src={Slip} alt="Slip Checking" width="280px">
                        </div>
                        <div class="text-gray-600 mt-5">
                            <strong class="text-lg">1. ส่งสลิปในกลุ่ม</strong>
                            <ul class="list-disc ml-5 text-sm">
                                <li>เมื่อบอทอยู่ในกลุ่มแล้ว คุณสามารถส่งสลิปไปในกลุ่มได้ทันที</li>
                                <li>สลิปที่ส่งต้องมี QR Code</li>
                            </ul>
                            <strong class="text-lg mt-4">2. การตอบกลับจากบอท</strong>
                            <ul class="list-disc ml-5 text-sm">
                                <li>บอทจะตรวจสอบและตอบกลับในกลุ่มทันที</li>
                                <li>บอทจะแสดงสถานะของสลิป เช่น หมายเลขอ้างอิง วันที่ และเวลาที่ตรวจสอบ</li>
                                <li>ถ้ามีปัญหา บอทจะแจ้งผลลัพธ์เพิ่มเติม</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div></Carousel.Item>
            
            </Carousel.Content>
            <Carousel.Previous />
            <Carousel.Next />
          </Carousel.Root>
          
        </div>
        <div class="text-center  content-center text-xl  " style="color: #0031E5;"><a href="/dashboard" >ไปหน้า แดชบอร์ด >></a></div>
      
    
    <!-- <div class="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="text-sm">
            <h2 class="text-2xl font-semibold">ขั้นตอนที่ 1: เชื่อมต่อ Line OA</h2>
            <img src={LineOA} alt="Line OA" height="50%" width="180px" class="mx-auto mb-4">
            <p class="text-gray-600">กดที่เมนู "Register" เพื่อเริ่มต้นลงทะเบียน ถ้าคุณใช้คอมพิวเตอร์ ให้พิมพ์คำว่า "menu"</p>
        </div>
    </div>

    <div class="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="text-sm">
            <h2 class="text-2xl font-semibold">ขั้นตอนที่ 2: เข้าสู่ระบบ</h2>
            <img src={Login} alt="Login Options" height="50%" width="800px" class="mx-auto mb-4 lg:block sm:block hidden">
            <img src={Logins} alt="Login Options Mobile" height="50%" width="800px" class="mx-auto mb-4 lg:hidden sm:hidden block">
            <p class="text-gray-600">เลือกบัญชีที่ต้องการใช้เข้าสู่ระบบ เช่น Facebook, Google, หรือ Line</p>
        </div>
    </div>

    <div class="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="text-sm">
            <h2 class="text-2xl font-semibold">ขั้นตอนที่ 3: เชื่อมต่อบัญชี Line</h2>
            <img src={profile} alt="Profile" height="50%" width="300px" class="mx-auto mb-4">
            <p class="text-gray-600">คุณสามารถเชื่อมต่อหลายบัญชี Line ได้ ทำตามขั้นตอนด้านล่าง:</p>
            <ul class="list-disc list-inside text-gray-600">
                <li>คลิกปุ่ม "Login With Line" เพื่อเชื่อมต่อบัญชี</li>
                <li>หลังจากเชื่อมต่อบัญชี จะเห็นบัญชีที่เชื่อมต่อในรายการ</li>
                <li>ถ้าอยากเชื่อมต่อบัญชีเพิ่ม ให้คลิก "Login With Line" อีกครั้ง</li>
            </ul>
            <p class="text-gray-600 my-2">หากต้องการยกเลิกการเชื่อมต่อ ให้คลิกเมนูข้างหลังชื่อบัญชีที่ต้องการยกเลิก</p>
            <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <a href="/profile">ไปหน้าการเชื่อมต่อ Line</a>
            </button>
        </div>
    </div>

    <div class="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="text-sm">
            <h2 class="text-2xl font-semibold">ขั้นตอนที่ 4: เลือกแพ็คเกจ</h2>
            <p class="text-gray-600 my-2">เลือกแพ็คเกจที่เหมาะกับคุณเพื่อเริ่มใช้งาน Check Slip</p>
            <img src={packages} alt="Package Options" class="w-full h-auto object-cover lg:hidden sm:hidden block" style="max-width: 600px;">
            <img src={packagess} alt="Package Options Large" class="w-full h-auto object-cover lg:block sm:block hidden">
            <p class="text-gray-600 my-3">เมื่อเลือกแพ็คเกจแล้ว กดปุ่ม "Buy Now" จะมี QR Code ให้สแกนชำระเงิน</p>
        </div>
        <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <a href="/package">ไปหน้าการเลือกแพ็คเกจ</a>
        </button>
    </div>

    <div class="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="text-sm">
            <h2 class="text-2xl font-semibold">ขั้นตอนที่ 5: เพิ่มบอทในกลุ่ม Line</h2>
            <div class="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                <div class="flex justify-center">
                    <img src={addGroup} alt="Add Bot to Group" width="250px">
                </div>
                <div>
                    <div class="text-gray-600 mt-5">
                        <strong class="text-lg"> สร้างกลุ่มและเชิญบอท</strong>
                        <ul class="list-disc ml-5 text-sm">
                            <li>หลังจากซื้อแพ็คเกจแล้ว ให้สร้างกลุ่ม Line เพื่อใช้ตรวจสอบสลิป</li>
                            <li>คลิก "สร้างกลุ่ม" เพื่อสร้างกลุ่มใหม่</li>
                            <li>เลือก "เชิญเพื่อน" และเพิ่ม Line OA Check Slip เข้ากลุ่ม</li>
                            <li>เชิญเพื่อนคนอื่นที่ต้องการใช้บริการด้วยได้</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="text-sm">
            <h2 class="text-2xl font-semibold">ขั้นตอนที่ 6: การตรวจสอบสลิป</h2>
            <div class="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                <div class="flex justify-center">
                    <img src={Slip} alt="Slip Checking" width="280px">
                </div>
                <div class="text-gray-600 mt-5">
                    <strong class="text-lg">1. ส่งสลิปในกลุ่ม</strong>
                    <ul class="list-disc ml-5 text-sm">
                        <li>เมื่อบอทอยู่ในกลุ่มแล้ว คุณสามารถส่งสลิปไปในกลุ่มได้ทันที</li>
                        <li>สลิปที่ส่งต้องมี QR Code</li>
                    </ul>
                    <strong class="text-lg mt-4">2. การตอบกลับจากบอท</strong>
                    <ul class="list-disc ml-5 text-sm">
                        <li>บอทจะตรวจสอบและตอบกลับในกลุ่มทันที</li>
                        <li>บอทจะแสดงสถานะของสลิป เช่น หมายเลขอ้างอิง วันที่ และเวลาที่ตรวจสอบ</li>
                        <li>ถ้ามีปัญหา บอทจะแจ้งผลลัพธ์เพิ่มเติม</li>
                    </ul>
                </div>
            </div>
        </div>
    </div> -->
</div>


