import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from "axios";
import { backendUrl } from '../App';
import toast from 'react-hot-toast';

const Add = ({ token }) => {

    const [img1, setImg1] = useState(false)
    const [img2, setImg2] = useState(false)
    const [img3, setImg3] = useState(false)
    const [img4, setImg4] = useState(false)

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [size, setSize] = useState([]);
    const [bestSeller, setBestSeller] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            // data
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestSeller", bestSeller)
            formData.append("sizes", JSON.stringify(size))
            // images
            img1 && formData.append("image1", img1)
            img2 && formData.append("image2", img2)
            img3 && formData.append("image3", img3)
            img4 && formData.append("image4", img4)

            const res = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })

            if (res.data.success) {
                toast.promise(res , {
                    loading : 'Loading ...',
                    success : 'Product Added Successfully!',
                    error : 'Something Went Wrong'
                })
                setImg1(false)
                setImg2(false)
                setImg3(false)
                setImg4(false)
                setPrice('')
            }
            else {
                toast.error(res.data.message)
            }

        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
        }
    }

    return (
        <form className='flex flex-col w-full items-start gap-3' onSubmit={onSubmitHandler}>
            <div>
                <p className='mb-2'>Upload Image</p>

                <div className='flex gap-2'>
                    <label htmlFor="img1">
                        <img className='w-20' src={!img1 ? assets.upload_area : URL.createObjectURL(img1)} alt="" />
                        <input onChange={(e) => setImg1(e.target.files[0])} type="file" id='img1' hidden />
                    </label>
                    <label htmlFor="img2">
                        <img className='w-20' src={!img2 ? assets.upload_area : URL.createObjectURL(img2)} alt="" />
                        <input onChange={(e) => setImg2(e.target.files[0])} type="file" id='img2' hidden />
                    </label>
                    <label htmlFor="img3">
                        <img className='w-20' src={!img3 ? assets.upload_area : URL.createObjectURL(img3)} alt="" />
                        <input onChange={(e) => setImg3(e.target.files[0])} type="file" id='img3' hidden />
                    </label>
                    <label htmlFor="img4">
                        <img className='w-20' src={!img4 ? assets.upload_area : URL.createObjectURL(img4)} alt="" />
                        <input onChange={(e) => setImg4(e.target.files[0])} type="file" id='img4' hidden />
                    </label>
                </div>
            </div>

            <div className='w-full'>
                <p className='mb-2'>Product Name</p>
                <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder='Type Here' className='w-full max-w-[500px] px-3 py-2' required />
            </div>

            <div className='w-full'>
                <p className='mb-2'>Product Description</p>
                <textarea type="text" placeholder='Write Content Here' onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' required />
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                <div>
                    <p className='mb-2'>Product Category</p>
                    <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Sub Category</p>
                    <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                        <option value="Topwear">Top Wear</option>
                        <option value="Bottomwear">Bottom Wear</option>
                        <option value="Winterwear">Winter Wear</option>
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Product Price</p>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' />
                </div>
            </div>

            <div>
                <p className='mb-2'>Product Sizes</p>
                <div className='flex gap-3'>
                    <div onClick={() => setSize(prev => prev.includes("S") ? prev.filter(item => item !== 'S') : [...prev, "S"])}>
                        <p className={`${size.includes("S") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
                    </div>
                    <div onClick={() => setSize(prev => prev.includes("M") ? prev.filter(item => item !== 'M') : [...prev, "M"])}>
                        <p className={`${size.includes("M") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
                    </div>
                    <div onClick={() => setSize(prev => prev.includes("L") ? prev.filter(item => item !== 'L') : [...prev, "L"])}>
                        <p className={`${size.includes("L") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
                    </div>
                    <div onClick={() => setSize(prev => prev.includes("XL") ? prev.filter(item => item !== 'XL') : [...prev, "XL"])}>
                        <p className={`${size.includes("XL") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
                    </div>
                    <div onClick={() => setSize(prev => prev.includes("XXL") ? prev.filter(item => item !== 'XXL') : [...prev, "XXL"])}>
                        <p className={`${size.includes("XXL") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
                    </div>
                </div>
            </div>

            <div className='flex gap-2 mt-2'>
                <input onChange={() => setBestSeller(prev => !prev)} checked={bestSeller} type="checkbox" id="bestseller" />
                <label className='cursor-pointer' htmlFor="bestseller">Add to Best Seller</label>
            </div>

            <button type='submit' className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>ADD</button>

        </form>
    )
}

export default Add