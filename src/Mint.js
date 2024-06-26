import React, {Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";
import downSvg from './assets/svg/down.svg';
import openseaSvg from './assets/svg/opensea.svg';

import images from "./data/images";
import { preprocess } from './utils';

import useNftContract from './web3/useNFTContract';

const Mint = () => {

    const {
        account,
        active, 
        chainId
    } = useWeb3React();

    const [items, setItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [available, setAvailable] = useState(false);

    const {cardType, setCardType, price, remain, limitPerAccount, mintNFT, result, balance} = useNftContract();

    const goNext = () => {
        setCardType((cardType + 1) % 5);
    }

    const goPrev = () => {
        setCardType((5 + cardType - 1) % 5);
    }
    
    const mint = async () => {
        if(available) {
            await mintNFT(cardType, quantity);
        }
    }

    const validateQuantity = (quantity) => {
        let res = quantity;
        if(quantity < 1) res = 1;
        if(res +  balance > limitPerAccount) res = limitPerAccount - balance;
        setTotalPrice(price * res);
        return res;
    }

    const connectWallet = () => {
        const walletButton = document.querySelector('#connect_wallet');
        if(walletButton) walletButton.click();
    }

    useEffect(() => {
        preprocess();
    }, []);

    useEffect(() => {
        if(result != null) {
            console.log(result)
        }
    }, [result])

    useEffect(() => {
        if(quantity < 1 || remain < 1 || !active) {
            setAvailable(false);
        }else {
            setAvailable(true);
        }
    }, [quantity, remain])

    useEffect(() => {
        console.log(price, remain, limitPerAccount, balance)
        setQuantity(validateQuantity(1));
        setTotalPrice(price * validateQuantity(1));
    }, [price, remain, balance, limitPerAccount])


    return(
        <>
        <div className="metaportal_fn_main">
            <div className="metaportal_fn_content">
                <div className="metaportal_fn_mintpage">
                    <div className="container small">
                        <div className="metaportal_fn_mint_top">
                            <div className="mint_left">
                                <div className="mint_fn_cs_slider">
                                    {
                                        images.map((image, index) => {
                                            return (
                                                <div key={index} className="img" style={{display: index === cardType ? 'block' : 'none'}}>
                                                    <div className="img_in" style={{backgroundImage:'url('+image.imgURL+')'}}>
                                                        <img src={image.imgURL} alt="" />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                    <div className="mint_slider_nav">
                                        <span onClick={goPrev} className="prev" style={{cursor: 'pointer'}}>
                                            <span className="circle"></span>
                                            <span className="icon"><img src={downSvg} alt="" className="fn__svg" /></span>
                                            <span className="circle"></span>
                                        </span>
                                        <span onClick={goNext} className="next">
                                            <span className="circle"></span>
                                            <span className="icon"><img src={downSvg} alt="" className="fn__svg" /></span>
                                            <span className="circle"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mint_right">

                                <h3 className="fn__maintitle" data-text="Biki Wodoo Club" data-align="left">Biki Wodoo Club</h3>
                                <div className="desc">
                                    <p>Suspendisse eu velit est. Cras nec vestibulum quam. Donec tincidunt purus nec enim tincidunt, sit amet facilisis massa laoreet. Integer mollis nec sapien eu lacinia. Nunc eu massa dictum, vulputate neque ac, porta mauris. Sed sollicitudin nisi augue, a gravida turpis elementum vel. Curabitur sagittis quis diam et rhoncus. Nam pellentesque imperdiet aliquet. Sed non ante malesuada, ultrices sem at, tempus libero.</p>
                                    <p>{images[cardType].imgAlt}</p>
                                    <p>Duis eu lorem ut mauris pulvinar auctor. Maecenas et dapibus orci, eleifend euismod justo. Quisque luctus turpis eu tristique feugiat. Praesent ac magna feugiat, interdum lacus ac, interdum dui. Pellentesque id quam quis enim malesuada rutrum. Orci varius natoque penatibus et magnis dis parturient.</p>
                                </div>
                                <div className="view_on">
                                    <ul>
                                        <li>
                                            <span>View On:</span>
                                        </li>
                                        <li>
                                            <Link to=""><img src={openseaSvg} alt="" className="fn__svg" /></Link>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="metaportal_fn_mintbox">
                            <div className="mint_left">
                                <div className="mint_title"><span>Public Mint is Live</span><span>{images[cardType].imgAlt}</span></div>
                                <div className="mint_list">
                                    <ul>
                                        <li>
                                            <div className="item">
                                                <h4>Price</h4>
                                                <h3>{price} ETH</h3>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="item">
                                                <h4>Remaining</h4>
                                                <h3><span id="totalSupply">{1000 - remain}</span>/<span id="maxSupply">1000</span></h3>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="item">
                                                <h4>Quantity</h4>
                                                <div className="qnt">
                                                    <span className="decrease" onClick={ () => setQuantity( validateQuantity(quantity - 1))}>-</span>
                                                    <span className="summ" data-price="0.02" id="mint_amount">{quantity}</span>
                                                    <span className="increase" onClick={ () => setQuantity( validateQuantity(quantity + 1))}>+</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="item">
                                                <h4>Total Price</h4>
                                                <h3><span className="total_price" id="total_price">{totalPrice}</span> ETH + GAS</h3>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mint_desc" id="mintNow">
                                    {
                                        active ? (
                                        <>
                                        <span  className="metaportal_fn_button" style={{cursor:'pointer'}}>
                                            <span onClick={mint}>{balance > 5 ? 'Limit maximum mint' : 'Mint Now'}</span>
                                        </span>
                                        <p>Available: {5 - balance}</p>
                                        <p>By clicking “MINT NOW” button, you agree to our <a href="#">Terms of Service</a> and our <a href="#">Privacy Policy</a>.</p>
                                        </>) :
                                        (<span  className="metaportal_fn_button" style={{cursor:'pointer'}}>
                                            <span onClick={connectWallet}>Connect Wallet</span>
                                        </span>)
                                    }
                                    
                                </div>
                            </div>
                            <div className="mint_right">
                                <div className="mright">
                                    <div className="mint_time">
                                        <h4>Public Mint Ends In</h4>
                                            There is two types of countdown: due_date (Due Date), ever (Evergreen timer)
                                                1. 	data-type="due_date"
                                                    In this case you have to change value of data-date. For example:
                                                    data-date="October 13, 2022 12:30:00"
                                                    It will mean that mint will finished at this time

                                                2. 	data-type="ever"
                                                    In this case you have to change values of data-days, data-hours, data-minutes and data-seconds. For example:
                                                    data-days="34"
                                                    data-hours="10"
                                                    data-minutes="20"
                                                    data-seconds="0"
                                                    It will mean that the time expires after this time, but when the page is refreshed, the value will return again. It means, it won't end.
                                        <h3 className="metaportal_fn_countdown" data-type="ever" data-date="October 13, 2022 12:30:00" data-days="34" data-hours="10" data-minutes="20" data-seconds="0">0d: 0h: 0m: 0s</h3>
                                    </div>
                                    <div className="mint_checked">
                                        <p>
                                            <span className="text">Whitelist:</span>
                                            <span className="status">Soldout <span className="icon"><img src="svg/checked.svg" alt="" className="fn__svg" /></span></span>
                                        </p>
                                        <p>
                                            <span className="text">Presale:</span>
                                            <span className="status">Soldout <span className="icon"><img src="svg/checked.svg" alt="" className="fn__svg" /></span></span>
                                        </p>
                                    </div>
                                    <div className="mint_info">
                                        <p>You need to pay a GAS fee during minting. We allow max 5 mints per wallet.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <a href="#" className="metaportal_fn_totop">
                <span className="totop_inner">
                    <span className="icon">
                        <img src={downSvg} alt="" className="fn__svg replaced-svg" />
                    </span>
                    <span className="text">Scroll To Top</span>
                </span>
            </a>


        </div>
        </>
    )
}

export default Mint;