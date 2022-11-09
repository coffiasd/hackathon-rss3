import { React, useState,useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import RateData from '../data/Rate.json';
import NoteData from '../data/Note.json';
import { interpolateRainbow } from "d3-scale-chromatic";
import CountUp from 'react-countup';
import { FaSortNumericDownAlt, FaSortNumericUpAlt, FaDollarSign } from 'react-icons/fa';
import { alertService } from '../services';
import ReactLoading from 'react-loading';

export default function Charts() {
    const [loading, setLoading] = useState(false)
    const [Note, setNote] = useState(NoteData)
    const [Rates,setRates] = useState(RateData)
    const [address, setAddress] = useState("")
    const BANDS = 9
    const transactionNetwork = {}
    const transactionValue = {}
    const exchangePlatform = {}
    const socialPlatform = {}
    let totalAmount = 0
    let totalTransation = 0
    let totalDefiSwap = 0
    let totalSocialPost = 0
    const optionsAlert = {
        autoClose: true,
        keepAfterRouteChange: false
    }

    /// fetch rates data
    useEffect(() => {
        fetch('http://api.coinlayer.com/live?access_key=7aa068b9a248cdf1d207e5aa5672b0d6')
          .then((res) => res.json())
          .then((data) => {
            setRates(data)
            console.log(data)
          })
      }, [])

    const clickFetchData = (address) => {
        if (address == "") {
            return
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 5000);

        const options = { method: 'GET', headers: { accept: 'application/json' } };
        fetch('https://pregod.rss3.dev/v1/notes/' + address + '?limit=500&include_poap=false&count_only=false&query_status=false', options)
            .then(response => response.json())
            .then(response => {
                setLoading(false);
                if (response.error) {
                    alertService.info(response.error, optionsAlert);
                } else {
                    setNote(response)
                }
            })
            .catch(err => console.error(alertService.info(err, optionsAlert)));
    }

    // fetchData("vitalik.eth")

    const getFloatNumer = (s) => {
        return parseFloat(s)
    }

    const getColors = (n) => {
        let r = []
        for (let i = 1; i <= n; i++) {
            r.push(interpolateRainbow(i / BANDS));
        }
        return r
    }

    ///analyze
    for (let i = 0; i < Note.result.length; i++) {
        let item = Note.result[i];
        if (item.tag == "transaction") {
            if (transactionNetwork[item.network]) {
                transactionNetwork[item.network] = transactionNetwork[item.network] + 1;
            } else {
                transactionNetwork[item.network] = 1;
            }

            totalTransation = totalTransation + 1

            for (let it in item.actions) {
                if (!Object.keys(Rates.rates).includes(item.actions[it].metadata.symbol)) {
                    continue
                }
                let value_display = item.actions[it].metadata.value_display ? item.actions[it].metadata.value_display : item.actions[it].metadata.value / Math.pow(10, item.actions[it].metadata.decimals);

                if (transactionValue[item.actions[it].metadata.symbol]) {
                    transactionValue[item.actions[it].metadata.symbol] = transactionValue[item.actions[it].metadata.symbol] + getFloatNumer(value_display) * Rates.rates[item.actions[it].metadata.symbol];
                } else {
                    transactionValue[item.actions[it].metadata.symbol] = getFloatNumer(value_display) * Rates.rates[item.actions[it].metadata.symbol];
                }
                totalAmount = totalAmount + getFloatNumer(value_display) * Rates.rates[item.actions[it].metadata.symbol]
            }
        }

        if (item.tag == "exchange") {
            totalDefiSwap = totalDefiSwap + 1
            if (exchangePlatform[item.platform]) {
                exchangePlatform[item.platform] = exchangePlatform[item.platform] + 1;
            } else {
                exchangePlatform[item.platform] = 1;
            }
        }

        if (item.tag == "social") {
            let social = item.platform ? item.platform : item.network
            totalSocialPost = totalSocialPost + 1
            if (socialPlatform[social]) {
                socialPlatform[social] = socialPlatform[social] + 1;
            } else {
                socialPlatform[social] = 1;
            }
        }
    }

    ChartJS.register(ArcElement, Tooltip, Legend);
    ChartJS.register(ChartDataLabels);

    const COLORS1 = getColors(10);

    const data = {
        labels: Object.keys(transactionValue),
        datasets: [
            {
                label: "",
                data: Object.values(transactionValue),
                backgroundColor: COLORS1,
                borderColor: COLORS1,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            datalabels: {
                formatter: function (value, context) {
                    if (value > 1) {
                        return context.chart.data.labels[
                            context.dataIndex
                        ];
                    } else {
                        return ""
                    }
                },
            },
        },
    }

    const dataTransaction = {
        labels: Object.keys(transactionNetwork),
        datasets: [
            {
                label: '# of Votes',
                data: Object.values(transactionNetwork),
                backgroundColor: getColors(Object.keys(transactionNetwork).length),
                borderColor: getColors(Object.keys(transactionNetwork).length),
                borderWidth: 1,
            },
        ],
    };

    const dataDefi = {
        labels: Object.keys(exchangePlatform),
        datasets: [
            {
                label: '# of Votes',
                data: Object.values(exchangePlatform),
                backgroundColor: getColors(Object.keys(exchangePlatform).length),
                borderColor: getColors(Object.keys(exchangePlatform).length),
                borderWidth: 1,
            },
        ],
    };

    const dataSocialfi = {
        labels: Object.keys(socialPlatform),
        datasets: [
            {
                label: '# of Votes',
                data: Object.values(socialPlatform),
                backgroundColor: getColors(Object.keys(socialPlatform).length),
                borderColor: getColors(Object.keys(socialPlatform).length),
                borderWidth: 1,
            },
        ],
    };

    return (
        <>

            <div className='flex justify-center'>

                <div className='w-1/4 m-16'>
                    <form className="flex items-center">
                        <label for="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                            </div>
                            <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ens or 0x..." required="" onChange={e => setAddress(e.target.value)} />
                        </div>
                        {loading ? (<ReactLoading className='ml-5' type="spinningBubbles" color="#9370D8" height={50} width={50} />) : (<button type="button" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>clickFetchData(address)}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <span className="sr-only">Search</span>
                        </button>)}
                       

                    </form>
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="stats shadow w-auto mt-5">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaDollarSign size="2rem" />
                        </div>
                        <div className="stat-title font-black">total amount</div>
                        <div className="stat-value text-primary">
                            <CountUp
                                start={0}
                                end={totalAmount}
                                duration={2}
                                separator=","
                                decimals={0}
                                decimal=","
                                prefix="$ "
                            /></div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <FaSortNumericDownAlt size="2rem" />
                        </div>
                        <div className="stat-title font-black">total transactions</div>
                        <div className="stat-value text-secondary"><CountUp
                            start={0}
                            end={totalTransation}
                            duration={1}
                            separator=","
                            decimals={","}
                            decimal=","
                            prefix=" "
                        /></div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaSortNumericDownAlt size="2rem" />
                        </div>
                        <div className="stat-title font-black">total defi swap</div>
                        <div className="stat-value text-primary"><CountUp
                            start={0}
                            end={totalDefiSwap}
                            duration={2}
                            separator=","
                            decimals={0}
                            decimal=","
                            prefix=""
                        /></div>
                    </div>
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <FaSortNumericUpAlt size="2rem" />
                        </div>
                        <div className="stat-title font-black">total social posts</div>
                        <div className="stat-value text-secondary"><CountUp
                            start={0}
                            end={totalSocialPost}
                            duration={2}
                            separator=","
                            decimals={0}
                            decimal=","
                            prefix=""
                        /></div>
                    </div>
                </div>
            </div>

            <div className="grid gap-2 grid-cols-4 grid-rows-1 m-5 mt-20 mb-40">
                <div className=''>
                    <div className='bg-white m-auto p-6 rounded-2xl'>
                        <div className='h1 font-black'>each token number in transactions</div>
                        <Doughnut data={data} options={options} />
                    </div>
                </div>
                <div className=''>
                    <div className='bg-white m-auto p-6 rounded-2xl'>
                        <div className='h1 font-black'>transaction network percent</div>
                        <Pie data={dataTransaction} />
                    </div>
                </div>
                <div className=''>
                    <div className='bg-white m-auto  p-6 rounded-2xl'>
                        <div className='h1 font-black'>defi transaction protocal percent</div>
                        <Pie data={dataDefi} />
                    </div>
                </div>
                <div className=''>
                    <div className='bg-white m-auto  p-6 rounded-2xl'>
                        <div className='h1 font-black'>socialfi post protocal percent</div>
                        <Pie data={dataSocialfi} />
                    </div>
                </div>
            </div>

        </>
    )
}