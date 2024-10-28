<script lang="ts">
	import { Bar } from 'svelte-chartjs';
	import { Chart, registerables, type ChartOptions } from 'chart.js';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import * as Card from '$lib/components/ui/card';
	import { afterUpdate, onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import cookie from 'cookie';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import flatpickr from 'flatpickr';
	import { Thai } from 'flatpickr/dist/l10n/th.js';
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index';
	import 'flatpickr/dist/plugins/monthSelect/style.css';
	import date from '$lib/image/calendar.png';
	// Register Chart.js components
	Chart.register(...registerables);
	Chart.register(ChartDataLabels);
	let dataChart: any[] = [];
	let labels: string[] = [];
	let successValues: number[] = [];
	let failedValues: number[] = [];

	let newlabels: string[] = [];
	let startDatePicker: Node;
	let selectedStartDate = new Date();
	let chart: { update: () => void };
	onMount(async () => {
		flatpickr(startDatePicker, {
			plugins: [
				monthSelectPlugin({
					shorthand: true, // ใช้ตัวย่อสำหรับชื่อเดือน
					dateFormat: 'Y-m', // รูปแบบวันที่ที่ส่ง
					// ค่าตั้งต้น
					defaultDate: selectedStartDate
				})
			],
			locale: Thai,
			onChange: (selectedDates) => {
				selectedStartDate = selectedDates[0]; // อัปเดตค่าวันที่เมื่อเปลี่ยน
				startDatePicker.value = formatDateSelect(selectedStartDate); // อัปเดตค่าของ input เมื่อเปลี่ยนเดือน
			}
		});

		startDatePicker.value = formatDateSelect(selectedStartDate); // ตั้งค่าเริ่มต้นใน input
		try {
			const datachart = await GetdataChart();
			dataChart = datachart;

			console.log('Chart : ', datachart);
			const newlabels = Array.from(new Set(dataChart.map((item) => formatDate(item.CreatedAt))));
			const counts = {
				SUCCESS: Array(newlabels.length).fill(0),
				FAILED: Array(newlabels.length).fill(0),
				PENDING: Array(newlabels.length).fill(0),
				RESPOND_REJECTED: Array(newlabels.length).fill(0),
				REQUEST_REJECTED: Array(newlabels.length).fill(0)
			};
			dataChart.forEach((item: { CreatedAt: any; Status: any }) => {
				const labelIndex = newlabels.indexOf(formatDate(item.CreatedAt));
				if (labelIndex !== -1) {
					switch (item.Status) {
						case 'SUCCESS':
						case 'success':
							counts.SUCCESS[labelIndex]++;
							break;
						case 'FAILED':
							counts.FAILED[labelIndex]++;
							break;
						case 'PENDING':
							counts.PENDING[labelIndex]++;
							break;
						case 'RESPOND_REJECTED':
							counts.RESPOND_REJECTED[labelIndex]++;
							break;
						case 'REQUEST_REJECTED':
							counts.REQUEST_REJECTED[labelIndex]++;
							break;
						default:
							break;
					}
				}
			});

			data.labels = newlabels;
			data.datasets[0].data = counts.SUCCESS;
			data.datasets[1].data = counts.FAILED;
			data.datasets[2].data = counts.PENDING;
			data.datasets[3].data = counts.REQUEST_REJECTED;
			data.datasets[4].data = counts.RESPOND_REJECTED;
			data.datasets[5].data = Array.from({ length: newlabels.length }, () => 0);

			// Log the results
			console.log(
				'ข้อมูล res :',
				newlabels,
				counts.SUCCESS,
				counts.FAILED,
				counts.RESPOND_REJECTED,
				counts.REQUEST_REJECTED,
				counts.PENDING
			);

			if (chart) {
				chart.update(); // Ensure chart is updated with new data
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
		}
	});

	function formatDate(dateString: any) {
		const date = new Date(dateString);

		// ตรวจสอบว่ามีวันที่ถูกต้องหรือไม่
		if (isNaN(date.getTime())) {
			return 'Invalid date'; // คืนค่าข้อความหากวันที่ไม่ถูกต้อง
		}

		// แปลงวันที่เป็นรูปแบบ "18 ก.ย. 2024"
		const day = date.getDate();
		const month = date.toLocaleString('th-TH', { month: 'short' });
		const year = date.getFullYear(); // ปี ค.ศ.

		return `${day} ${month} ${year}`; // คืนค่าในรูปแบบ "18 ก.ย. 2024"
	}
	const GetdataChart = async () => {
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		const formattedStartDate = selectedStartDate.toISOString().slice(0, 7); // YYYY-MM
		const [year, month] = formattedStartDate.split('-');
		console.log('เดือน ', year, month, typeof formattedStartDate);
		const id = sessionStorage.getItem('merchant_id'); // Waiting for id from another page
		console.log('id: ', id, typeof id);
		let apiUrl;
		if (myCookie && myCookie.Type === 'Line') {
			apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonthline/${myCookie.Email}/${month}/${year}`;
		} else if (myCookie) {
			apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonth/${myCookie.Id}/${month}/${year}`;
		} else {
			console.error('No valid merchant account cookie found.');
			return;
		}
		// Create URL parameters from form data
		let config = {
			method: 'GET', //การทำงาน get post update delete
			headers: {
				'Content-Type': 'application/json'
			}
		};
		var result = await fetch(apiUrl, config);
		const datas = await result.json();
		console.log('Fetched data:', datas.result);
		if (datas) {
			return datas.result;
		}
	};

	// Sample data for the bar chart

	const data = {
		labels: Array.from({ length: 30 }, (_, i) => `Jul ${i + 1}`),

		datasets: [
			{
				label: 'สลิปถูกต้อง',
				data: successValues,
				backgroundColor: 'rgba(71, 205, 137, 0.8)', // Green background
				borderColor: 'rgba(0, 128, 0, 1)', // Green border
				borderWidth: 1
			},
			{
				label: 'สลิปผิด',
				data: failedValues, // ตั้งค่าให้มีค่าเท่ากันสำหรับทุกเดือน
				backgroundColor: 'rgba(240, 68, 56, 0.8)', // Red background
				borderColor: 'rgba(255, 0, 0, 1)', // Red border
				borderWidth: 1
			},
			{
				label: 'สลิปรอกาตรวจสอบ',
				data: successValues,
				backgroundColor: 'rgba(247, 144, 9, 0.8)', // ส้มพื้นหลัง
				borderColor: 'rgba(247, 144, 9, 1)', // ส้มขอบ
				borderWidth: 1
			},
			{
				label: 'สลิปคำขอถูกปฏิเสธ',
				data: successValues,
				backgroundColor: 'rgba(133, 136, 142, 0.8)', // เทาพื้นหลัง
				borderColor: 'rgba(133, 136, 142, 1)', // เทาขอบ
				borderWidth: 1
			},
			{
				label: 'สลิปปฏิเสธการตอบ',
				data: successValues,
				backgroundColor: 'rgba(19, 83, 236, 0.8)', // น้ำเงินพื้นหลัง
				borderColor: 'rgba(19, 83, 236, 1)', // น้ำเงินขอบ
				borderWidth: 1
			},
			{
				label: '',
				data: [], // จะถูกกรอกภายหลังด้วยค่ารวมที่คำนวณ
				backgroundColor: 'rgba(0, 0, 0, 0)', // สีพื้นหลังเหลือง
				borderColor: 'rgba(0, 0, 0, 0)',
				borderWidth: 1
			}
		]
	};

	// Chart options
	const options = {
		responsive: true,
		plugins: {
			datalabels: {
				formatter: (
					value: number,
					context: {
						datasetIndex: any;
						dataIndex: any;
						chart: {
							getDatasetMeta: any;
							data: { datasets: any };
						};
					}
				) => {
					
					const { datasetIndex, dataIndex, chart } = context;
					const datasets = chart.data.datasets;
					console.log('total ', datasetIndex, 'datasets', datasets.length, datasetIndex);
					// ถ้าเป็น dataset บนสุด ให้แสดงยอดรวม
					if (datasetIndex === datasets.length - 1) {
						const total = datasets
							.slice(0, -1)
							.reduce((sum: number, dataset: { data: { [x: string]: any } }, index: any) => {
								// ตรวจสอบว่า dataset ถูกซ่อนไว้หรือไม่โดยใช้ getDatasetMeta
								const meta = chart.getDatasetMeta(index);
                
								if (!meta.hidden) {
                  
									const value = dataset.data[dataIndex];
									return sum + (typeof value === 'number' ? value : 0);
								}
								return sum;
							}, 0);
              
              return total === 0 ? '' : `T : ${total}`;

						// return value === 0 ? '' : `${total}`;
					} else {
						return value === 0 || value === 1 ? '' : `${value}`;
						// return `${value}`;
					}
				},
				anchor: (context: { datasetIndex: any; chart: { data: { datasets: any } } }) => {
					const datasetIndex = context.datasetIndex;
					const datasets = context.chart.data.datasets;
					if (datasetIndex === datasets.length) {
						return 'end'; // แสดงยอดรวมที่ด้านบนสุด
					}
					return 'center'; // แสดงค่าของแต่ละโซนตรงกลาง
				},
				align: (context: { datasetIndex: any; chart: { data: { datasets: any } } }) => {
					const datasetIndex = context.datasetIndex;
					const datasets = context.chart.data.datasets;
					if (datasetIndex === datasets.length - 1) {
						return 'end'; // จัดให้ยอดรวมอยู่ด้านบนสุด
					}
					return 'center'; // จัดให้ค่าของแต่ละโซนอยู่ตรงกลาง
				},
				offset: 0,
				color: '#000',
				font: {
					size: 12, // ขนาดตัวอักษร
					weight: 'bold'
				},
				padding: {
					bottom: 5 // ระยะห่างจากขอบล่างของแท่ง
				}
			}
		},
		animation: {
			duration: 1000,
			easing: 'easeInOutQuart'
		},

		scales: {
			x: {
				stacked: true, // ปิดการซ้อนทับของแท่งบนแกน x
				ticks: {
					color: 'black', // ตั้งค่าสีของอักษรบนแกน x
					font: {
						size: 10, // ตั้งค่าขนาดตัวอักษร
						weight: 'normal' // ตั้งค่าความหนาของตัวอักษร
					}
				},
				grid: {
					display: false // ไม่แสดง grid lines บนแกน x
				}
			},
			y: {
				stacked: true, // ปิดการซ้อนทับของแท่งบนแกน y
				ticks: {
					color: 'black', // ตั้งค่าสีของอักษรบนแกน y
					font: {
						size: 10, // ตั้งค่าขนาดตัวอักษร
						weight: 'normal' // ตั้งค่าความหนาของตัวอักษร
					}
				},
				grid: {
					display: false // ไม่แสดง grid lines บนแกน y
				}
			}
		}
	};

	let searchPerformed = false;
	let dataSearch: any[] = [];
	async function SearchData() {
		const formattedStartDate = selectedStartDate.toISOString().slice(0, 7);
		const datasearch = await searchGetdata(formattedStartDate);

		dataSearch = datasearch;
		console.log('res : ', dataSearch);
		searchPerformed = true;
		newlabels = Array.from(new Set(dataSearch.map((item) => formatDate(item.CreatedAt))));
		const counts = {
			SUCCESS: Array(newlabels.length).fill(0),
			FAILED: Array(newlabels.length).fill(0),
			PENDING: Array(newlabels.length).fill(0),
			RESPOND_REJECTED: Array(newlabels.length).fill(0),
			REQUEST_REJECTED: Array(newlabels.length).fill(0)
		};
		dataSearch.forEach((item) => {
			const labelIndex = newlabels.indexOf(formatDate(item.CreatedAt));
			if (labelIndex !== -1) {
				switch (item.Status) {
					case 'SUCCESS':
					case 'success':
						counts.SUCCESS[labelIndex]++;
						break;
					case 'FAILED':
						counts.FAILED[labelIndex]++;
						break;
					case 'PENDING':
						counts.PENDING[labelIndex]++;
						break;
					case 'RESPOND_REJECTED':
						counts.RESPOND_REJECTED[labelIndex]++;
						break;
					case 'REQUEST_REJECTED':
						counts.REQUEST_REJECTED[labelIndex]++;
						break;
					default:
						break;
				}
			}
		});
		data.labels = newlabels;
		data.datasets[0].data = counts.SUCCESS;
		data.datasets[1].data = counts.FAILED;
		data.datasets[2].data = counts.PENDING;
		data.datasets[3].data = counts.REQUEST_REJECTED;
		data.datasets[4].data = counts.RESPOND_REJECTED;
		data.datasets[5].data = Array.from({ length: newlabels.length }, () => 0);
		console.log(
			'ข้อมูล res :',
			newlabels,
			counts.SUCCESS,
			counts.FAILED,
			counts.RESPOND_REJECTED,
			counts.REQUEST_REJECTED,
			counts.PENDING
		);

		if (chart) {
			chart.update(); // Ensure chart is updated with new data
		}
	}
	function getCookies() {
		return cookie.parse(document.cookie);
	}
	const searchGetdata = async (param1: string) => {
		// const id = sessionStorage.getItem('merchant_id');

		let [year, month] = param1.split('-');

		month = parseInt(month, 10);
		month += 1; // Increment month
		if (month > 12) {
			month = 1; // Wrap around to January
			year = (parseInt(year, 10) + 1).toString(); // Increment year
		}
		console.log('param1', param1, year, month);
		const cookies = getCookies();
		const myCookie = cookies['merchant_account'] ? JSON.parse(cookies['merchant_account']) : null;
		console.log('++++++++++', myCookie.Id, myCookie.Email);

		let apiUrl;
		if (myCookie && myCookie.Type === 'Line') {
			apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonthline/${myCookie.Email}/${month}/${year}`;
		} else if (myCookie) {
			apiUrl = `${PUBLIC_API_ENDPOINT}/trasaction/transactionmonth/${myCookie.Id}/${month}/${year}`;
		} else {
			console.error('No valid merchant account cookie found.');
			return;
		}
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const result = await fetch(apiUrl, config);
		const datas = await result.json();
		console.log('data res : ', datas.result);
		return datas.result;
	};

	//     afterUpdate(() => {
	//     if (chart) {
	//         chart.update(); // Ensure chart is updated with new data
	//     }
	// });
	const formatDateSelect = (/** @type {Date} */ date: Date) => {
		const months = [
			'ม.ค.',
			'ก.พ.',
			'มี.ค.',
			'เม.ย.',
			'พ.ค.',
			'มิ.ย.',
			'ก.ค.',
			'ส.ค.',
			'ก.ย.',
			'ต.ค.',
			'พ.ย.',
			'ธ.ค.'
		];
		const month = months[date.getMonth()]; // ใช้เดือนในภาษาไทย
		const year = date.getFullYear(); // ใช้ปี ค.ศ.
		return `${month} ${year}`;
	};
</script>

<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-1" style="height: 100%;">
	<div class="flex justify-between my-2 font-semibold" style="height: 30px;width:96%">
		<div>กราฟแสดงข้อมูลในช่วงเดือน</div>
		<div class="flex justify-end">
			<div class=" relative mx-3">
				<input
					type="text"
					bind:this={startDatePicker}
					class="max-w-44 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#17B26A] focus:border-transparent"
					readonly
				/>
				<img
					src={date}
					width="20px"
					class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
					alt="Calendar Icon"
				/>
			</div>

			<Button
				class=" flex text-center py-0 px-0  text-white   bg-primary hover:bg-[#050680] "
				on:click={() => SearchData()}
				style="width:40%;height:30px;"
				><div class="mx-3 content-center font-semibold" style="width:100%;height:100%">ค้นหา</div>
			</Button>
		</div>
	</div>
	<div style="height:100%;width:96%;" class="content-center">
		{#if searchPerformed == true}
			<Bar {data} {options} />
		{:else}
			<Bar {data} {options} />
		{/if}
	</div>
</div>
