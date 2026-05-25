import { useEffect, useState } from "react"
import cogsCalculatorService from "../services/cogsCalculatorService";

//assets
import { BsStars } from "react-icons/bs";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { RiAiGenerate2 } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

//helper
import { formatRupiah } from "../helper/rupiah"

export const CalculationPage = () => {

    const [isLoading, setIsLoading] = useState({
        product_modeling:false,
        cogs_calculator:false
    });
    //category
    const [category,setCategory] = useState([]);
    
    // Subscribe to COGS Calculator Service streams
    useEffect(()=> {
        console.log('[COMPONENT] CalculationPage mounted - Subscribing to reactive streams...');
        
        // Subscribe to product categories
        const categoriesSubscription = cogsCalculatorService.productCategories$.subscribe(data => {
            console.log('[COMPONENT] Product categories stream updated:', data.length, 'categories');
            setCategory(data);
        });

        // Subscribe to loading state
        const loadingSubscription = cogsCalculatorService.isLoading$.subscribe(data => {
            console.log('[COMPONENT] Loading state changed:', data);
            setIsLoading(prev => ({
                ...prev,
                cogs_calculator: data
            }));
        });
        
        // Fetch initial categories
        cogsCalculatorService.fetchProductCategories();
        
        // Cleanup subscriptions
        return () => {
            console.log('[COMPONENT] CalculationPage unmounted - Unsubscribing from streams');
            categoriesSubscription.unsubscribe();
            loadingSubscription.unsubscribe();
        };
    },[]);
    //product
    const [product,setProduct] = useState({
        'product_name': '',
        'product_category': '',
        'sales_target': 1000,
    })

    const handleProductChange = (e) => {
        const {name, value} = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    //variable cost row
    const [variableRows, setVariableRows] = useState([
        {
            material: "",
            qtyUsed: "",
            usageUnit: "",
            totalPrice: "",
            purchaseQty: "",
            purchaseUnit: "",
            costPerProduct: ""
        }
    ]);
    const addVariableRow = () => {
        setVariableRows([
            ...variableRows,
            {
                material: "",
                qtyUsed: null,
                usageUnit: "",
                totalPrice: null,
                purchaseQty: null,
                purchaseUnit: "",
                costPerProduct: null
            }
        ]);
    };
    const handleVariableRow = (
        index,
        field,
        value
    ) => {
        const updated = [...variableRows];
        updated[index][field] = value;
        setVariableRows(updated);
    };
    const handleDeleteVariableRow = (indexToDelete) => {
        setVariableRows(
            variableRows.filter(
                (_, index) => index !== indexToDelete
            )
        );
    };

    //fixed cost row
    const [fixedRows, setFixedRows] = useState([
        {
            costName: "",
            monthlyCost: "",
            allocatedCost: "",
        }
    ]);
    const addFixedRow = () => {
        setFixedRows([
            ...fixedRows,
            {
                costName: "",
                monthlyCost: null,
                allocatedCost: null,
            }
        ]);
    };
    const handleFixedRow = (
        index,
        field,
        value
    ) => {
        const updated = [...fixedRows];
        updated[index][field] = value;
        setFixedRows(updated);
    };
    const handleDeleteFixedRow = (indexToDelete) => {
        setFixedRows(
            fixedRows.filter(
                (_, index) => index !== indexToDelete
            )
        );
    };

    //set error
    const [error, setError] = useState({
        product_name: '',
        product_category:'',
        variable_rows:'',
        fixed_rows:''
    });

    //modeling product
    const handleModelingProduct = async (e) => {
        e.preventDefault();
        setError({
            product_name:'',
            product_category:'',
            variable_rows:'',
            fixed_rows:''
        });
        if(product.product_name.length<=0) {
            setError.product_name='Product Name must not empty';
            return;
        }
        if(product.product_category.length<=0) {
            setError.product_category='Product Category must not empty';
            return;
        }
        setIsLoading(prev => ({
            ...prev,
            product_modeling: true
        }));

        try {
            console.log('[COMPONENT] Starting product modeling...');
            const [variableResponse, fixedResponse] = await Promise.all([
                cogsCalculatorService.postProductVariables({
                    product_name:product.product_name,
                    category:product.product_category}),
                cogsCalculatorService.postProductFixedCosts({category:product.product_category})
            ]);
            //format variable rows
            // variableResponse sudah response.data.data dari service (direct array)
            const formattedVariableRows = 
                variableResponse.length > 0
                ? variableResponse.map((item)=> ({
                    material: item.material_name,
                    qtyUsed: item.usage_amount,
                    usageUnit: item.usage_unit,
                    totalPrice: item.purchase_total_price,
                    purchaseQty: item.purchase_quantity,
                    purchaseUnit: item.purchase_unit,
                    costPerProduct: item.cost_per_product
                })) :
                [{
                    material: "",
                    qtyUsed: "",
                    usageUnit: "",
                    totalPrice: "",
                    purchaseQty: "",
                    purchaseUnit: "",
                    costPerProduct: ""
                }];
            setVariableRows(formattedVariableRows);
            console.log('[COMPONENT] Variable rows loaded from stream');
            //format fixed rows
            // fixedResponse sudah response.data.data dari service (direct array)
            const formattedFixedRows =
                fixedResponse.length > 0
                ? fixedResponse.map((item) => ({
                    costName: item.cost_name,
                    monthlyCost: item.total_monthly_cost,
                    allocatedCost: item.allocated_cost_per_product,
                }))
                : [{
                    costName: "",
                    monthlyCost: "",
                    allocatedCost: "",
                }];
            setFixedRows(formattedFixedRows);
            console.log('[COMPONENT] Fixed rows loaded from stream');
        } catch (error) {
            console.error('[COMPONENT] Error in product modeling:', error.message);
        } finally {
            setIsLoading(prev => ({
                ...prev,
                product_modeling: false
            }));
        }
    }

    // hpp calculator
    const [cogsCalculation, setCogsCalculation] = useState({
        target_production:null,
        total_variable_cost:null,
        total_fixed_cost:null,
        fixed_cost_allocation:null,
        hpp_per_product:null
    });

    //handle count cogs
    const handleCogsSubmit = async (e) => {
        e.preventDefault();
        setError({
            product_name:'',
            product_category:'',
            variable_rows:'',
            fixed_rows:''
        });
        if(product.product_name.length<=0) {
            setError.product_name='Product Name must not empty';
            return;
        }
        if(product.product_category.length<=0) {
            setError.product_category='Product Category must not empty';
            return;
        }
        if(variableRows.length===0) {
            setError.variable_rows = 'Variable Row is Empty';
            return;
        }
        if(fixedRows.length===0) {
            setError.fixed_rows = 'Fixed Allocation Row is Empty';
            return;
        }
        const payload = {
            target_production:product.sales_target,
            variable_costs: variableRows.map(row => ({
                material_name: row.material,
                usage_used: Number(row.qtyUsed),
                usage_unit: row.usageUnit,
                purchase_total_price: Number(row.totalPrice),
                purchase_quantity: Number(row.purchaseQty),
                purchase_unit: row.purchaseUnit,
                cost_per_product: Number(row.costPerProduct),
            })),

            fixed_costs: fixedRows.map(row => ({
                cost_name: row.costName,
                total_monthly_cost: Number(row.monthlyCost),
                allocated_cost_per_product: Number(row.allocatedCost),
            }))
        };
        console.log('[COMPONENT] COGS Calculation Payload:', payload);
        try {
            const response = await cogsCalculatorService.calculateCogs(payload)
            console.log('[COMPONENT] COGS calculation result received');
            setCogsCalculation(response);
        } catch (error) {
            console.error('[COMPONENT] Error calculating COGS:', error.message);
        }
    }
return (
    <section className="flex flex-row gap-4 p-4 h-screen max-h-[90vh]">
        {/* material */}
        <div className="basis-2/3 flex flex-col gap-4">
            {/* product */}
            <form className="basis-1/5 flex flex-row gap-2 text-white">
                {/* product */}
                <div className="flex flex-col basis-2/3 custom-bg-color p-4 rounded-2xl outline-1 outline-gray-500">
                    <h1 className="font-bold text-2xl">Product Info</h1>
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-col">
                            <label htmlFor="product-name" className="font-semibold">Product Name</label>
                            <input 
                            id="product-name"
                            type="text"
                            name="product_name"
                            onChange={handleProductChange}
                            value={product.product_name} 
                            className="rounded-2xl outline-1 outline-gray-500 p-2"
                            placeholder="Burger"/>
                            {error.product_name && <p className="text-red-500">{error.product_name}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="product-category" className="font-semibold">Product Category</label>
                            <select
                            name="product_category"
                            value={product.product_category}
                            onChange={handleProductChange}
                            className="rounded-2xl outline-1 outline-gray-500 p-2">
                                <option value = "" className="custom-bg-color">Pilih Category</option>
                                {category.map((category)=>(
                                    <option
                                    key={category.id}
                                    value={category.name}
                                    className="custom-bg-color">
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {error.product_category && <p className="text-red-500">{error.product_category}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="sales-target" className="font-semibold">Monthly Sales Target</label>
                            <input 
                            id="sales-target"
                            type="number"
                            name="sales_target"
                            onChange={handleProductChange}
                            value={product.sales_target}
                            className="no-spinner p-2 rounded-2xl outline-1 outline-gray-500"
                            placeholder="1000"/>
                        </div>
                    </div>
                </div>
                {/* button */}
                <button 
                onClick={handleModelingProduct}
                className="text-cyan-500 gap-2 flex justify-center items-center basis-1/3 custom-bg-color cursor-pointer rounded-2xl outline-1 outline-gray-500 text-2xl font-bold">
                    {isLoading.product_modeling ? (
                        <DotLottieReact
                            src="https://lottie.host/030d7af9-a8e7-4f27-b5a6-653c49b6a9cd/xQKnuQMsDT.lottie"
                            loop
                            autoplay
                            className="max-h-[20vh] max-w-[20vh] fill-cyan-500"
                            />
                    ) : (
                        <>
                        <RiAiGenerate2 />
                        Generate</>
                    )}
                </button>
            </form>
            {/* product variable */}
            <div className="overflow-auto text-white basis-2/5 custom-bg-color p-4 rounded-2xl outline-1 outline-gray-500 scrollbar-none">
                <h2 className="font-bold text-xl">Variable Cost</h2>
                <table className="w-full
                    table-auto
                    border-separate
                    border-spacing-2">
                    <thead>
                        <tr>
                            <th rowSpan={2}>
                                Material
                            </th>
                            <th colSpan={3}>
                                Usage Per Product
                            </th>
                            <th colSpan={2}>
                                Material Purchase
                            </th>
                            <th rowSpan={2}>
                                Cost/Product
                            </th>
                        </tr>
                        <tr>
                            <th>Qty Used</th>
                            <th>Unit</th>
                            <th>Total Price</th>
                            <th>Qty Purchase</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variableRows.map((row,index)=>(
                            <tr key={index}>
                                <td>
                                    <input
                                        placeholder="Daging"
                                        className="max-w-[15vh] custom-input"
                                        value={row.material}
                                        onChange={(e)=>
                                            handleVariableRow(
                                                index,
                                                "material",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder="200"
                                        className="max-w-[15vh] no-spinner custom-input"
                                        value={row.qtyUsed}
                                        onChange={(e)=>
                                            handleVariableRow(
                                                index,
                                                "qtyUsed",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        placeholder="gram"
                                        className="max-w-[15vh] custom-input"
                                        value={row.usageUnit}
                                        onChange={(e)=>
                                            handleVariableRow(
                                                index,
                                                "usageUnit",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder="50000"
                                        className="max-w-[15vh] no-spinner custom-input"
                                        value={row.totalPrice}
                                        onChange={(e)=>
                                            handleVariableRow(
                                                index,
                                                "totalPrice",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder="5"
                                        className="max-w-[15vh] no-spinner custom-input"
                                        value={row.purchaseQty}
                                        onChange={(e)=>
                                            handleVariableRow(
                                                index,
                                                "purchaseQty",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        placeholder="kg"
                                        className="max-w-[15vh] custom-input"
                                        value={row.purchaseUnit}
                                        onChange={(e)=>
                                            handleVariableRow(
                                                index,
                                                "purchaseUnit",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder="2000"
                                        className="max-w-[15vh] no-spinner custom-input"
                                        value={row.costPerProduct}
                                        onChange={(e)=>
                                            handleVariableRow(
                                                index,
                                                "costPerProduct",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleDeleteVariableRow(                                                    index
                                            )
                                        }
                                        className="
                                            px-3
                                            py-1
                                            cursor-pointer">
                                        <MdDelete className="fill-red-500"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {error.variable_rows && <p className="text-red-500">{error.variable_rows}</p>}
                <button className="flex gap-2 fill-cyan-300 text-cyan-300 items-center
                cursor-pointer"
                onClick={addVariableRow}>
                    <CiCirclePlus />
                    Tambah Bahan
                </button>
            </div>
            {/* fixed product cost */}
            <div className="basis-2/5 flex flex-row gap-4 max-h-[30vh]">
                <div className="overflow-auto scrollbar-none text-white basis-3/4 custom-bg-color p-4 rounded-2xl outline-1 outline-gray-500">
                    <h2 className="font-bold text-xl">Cost Allocation</h2>
                    <table
                        className="w-full
                        border-separate
                        border-spacing-2">
                        <thead>
                            <tr>
                                <th>Expense Name</th>
                                <th className="flex flex-col">Total Cost <span className="text-base font-light">(per month)</span></th>
                                <th>Allocation per Product</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fixedRows.map((row,index)=>(
                                <tr key = {index}>
                                    <td>
                                        <input
                                            placeholder="Listrik"
                                            className="w-full custom-input"
                                            value={row.costName}
                                            onChange={(e)=>
                                                handleFixedRow(
                                                    index,
                                                    "costName",
                                                    e.target.value
                                                )
                                            }
                                            />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="200000"
                                            className="w-full no-spinner custom-input"
                                            value={row.monthlyCost}
                                            onChange={(e)=>
                                                handleFixedRow(
                                                    index,
                                                    "monthlyCost",
                                                    e.target.value
                                                )
                                            }
                                            />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="200"
                                            className="w-full no-spinner custom-input"
                                            value={row.allocatedCost}
                                            onChange={(e)=>
                                                handleFixedRow(
                                                    index,
                                                    "allocatedCost",
                                                    e.target.value
                                                )
                                            }
                                            />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleDeleteFixedRow(
                                                    index
                                                )
                                            }
                                            className="
                                                px-3
                                                py-1
                                                cursor-pointer">
                                            <MdDelete className="fill-red-500"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {error.fixed_rows && <p className="text-red-500">{error.fixed_rows}</p>}
                    <button className="flex gap-2 fill-cyan-300 text-cyan-300 items-center
                    cursor-pointer"
                    onClick={addFixedRow}>
                        <CiCirclePlus />
                        Tambah Bahan
                    </button>
                </div>
                <button 
                onClick={handleCogsSubmit}
                className="cursor-pointer font-bold text-2xl basis-1/4 flex flex-row custom-bg-color text-cyan-500 gap-2 justify-center items-center rounded-2xl outline-1 outline-gray-500">
                {isLoading.cogs_calculator ? (
                    <DotLottieReact
                        src="https://lottie.host/030d7af9-a8e7-4f27-b5a6-653c49b6a9cd/xQKnuQMsDT.lottie"
                        loop
                        autoplay
                        className="max-h-[20vh] max-w-[20vh] fill-cyan-500"
                        />
                ) : (
                    <>
                        <BsStars />
                        Count COGS
                    </>
                )}
                </button>
            </div>
        </div>
        {/* result */}
        <div className="basis-1/3 flex flex-col gap-4">
            {/* hpp */}
            <div className="text-white basis-1/3 custom-bg-color px-4 py-2 rounded-2xl outline-1 outline-gray-500">
                {cogsCalculation.hpp_per_product && (
                    <>
                    <h2 className="font-sm text-base">COGS TOTAL</h2>
                    <p className="font-bold text-3xl">{formatRupiah(Number(cogsCalculation.hpp_per_product)*50)}</p>
                    <p>per batch / 50 pcs</p>
                    <hr></hr>
                    <div className="w-full flex justify-between">
                        <h3>Variable Cost per Product</h3>
                        <p>{formatRupiah(cogsCalculation.total_variable_cost)}</p>
                    </div>
                    <div className="w-full flex justify-between">
                        <h3>Cost Allocation per Product</h3>
                        <p>{formatRupiah(cogsCalculation.fixed_cost_allocation)}</p>
                    </div>
                    <div className="w-full flex justify-between">
                        <h3>HPP per pcs</h3>
                        <p className="text-green-500">{formatRupiah(cogsCalculation.hpp_per_product)}</p>
                    </div>
                    </>
                )}
            </div>
            {/* price */}
            <div className="basis-2/3 custom-bg-color"></div>
        </div>
    </section>
    )
}