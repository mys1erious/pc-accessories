'use client';


import React, {useCallback, useContext, useRef, useState} from 'react';
import {AiFillFilter} from "react-icons/ai";
import {SafeBrand} from "@/app/types";
import {LocaleContext} from "@/app/contexts/LocaleContext";
import qs from "query-string";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import useFilterNavbar from "@/app/hooks/useFilterNavbar";
import {IoMdClose} from "react-icons/io";
import FilterNavbarList from "@/app/components/core/FilterNavbarList";
import MinMaxValueInput from "@/app/components/inputs/MinMaxValueInput";
import Button from "@/app/components/core/Button";
import SelectInput from "@/app/components/inputs/SelectInput";
import {BiSearch} from "react-icons/bi";
import {OrderByChoices} from "@/app/utils";


type FilterNavbarProps = {
    brands: SafeBrand[]
}


const FilterNavbar = ({brands}: FilterNavbarProps) => {
    const router = useRouter();
    const params = useSearchParams();
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    // @ts-ignore
    const {locale} = useContext(LocaleContext);
    const filterNavbar = useFilterNavbar();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [selectedOrderBy, setSelectedOrderBy] = useState<string>(OrderByChoices.DATE_ADDED);

    const toggleNavbar = () => {
        if (filterNavbar.isOpen) filterNavbar.onClose();
        else filterNavbar.onOpen();
    };

    const handleBrandOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, brand: SafeBrand) => {
        setQueryParams(e, {brand: brand.name});
    }, [router, params]);

    const handlePriceOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQueryParams(e, {
            min_price: minPrice.toString(),
            max_price: maxPrice.toString()
        }, true);
    }, [router, params, minPrice, maxPrice]);

    const handleOrderByOnChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>, value: string) => {
        setSelectedOrderBy(value);
        setQueryParams(e, {order_by: value});
    }, [router, params]);

    const setQueryParams = useCallback((
        e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>,
        queryParams: {[key: string]: string},
        skipDelete: boolean = false
    ) => {
        e.stopPropagation();

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            ...queryParams,
        }

        if (!skipDelete) {
            for (const key in queryParams) {
                if (params?.get(key) === queryParams[key])
                    delete updatedQuery[key];
            }
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, {skipNull: true});

        router.push(url);
    }, [router, params]);

    const handleClose = useCallback(() => {
        filterNavbar.onClose();
    }, [filterNavbar.isOpen]);

    const handleResetFilters = () => {
        router.push('/');
        setMinPrice(0);
        setMaxPrice(0);
    };

    if (!isMainPage) return null;

    return (
        <>
        <div className="fixed left-0 top-24 z-50">
            <button className="flex items-center rounded-r-xl bg-red-600 p-1 pr-2 text-white"
                    onClick={toggleNavbar}>
                {<AiFillFilter size={18}/>}
            </button>
        </div>
        {filterNavbar.isOpen && (
            <>
                <div className="fixed inset-0 z-40 outline-none focus:outline-none bg-neutral-800/60"
                     onClick={handleClose}/>
                <div ref={inputRef} className="fixed left-0 top-0 z-50 bg-gray-700 p-4 w-64 h-screen
                                               border-r border-gray-600 text-white">
                    <div className="text-xl font-bold pb-2 border-b border-gray-300">
                        <h2>
                            {locale.filters}
                            <button className="p-1 border-0 hover:opacity-70 transition absolute right-9"
                                    onClick={handleClose}>
                                <IoMdClose size={18}/>
                            </button>
                        </h2>
                        <Button label={locale.resetFilters} onClick={handleResetFilters} small/>
                    </div>
                    <div className="text-lg font-semibold border-b border-gray-300 pb-4">
                        {locale.orderBy}
                        <select className="w-full font-light text-sm p-1 bg-white border-2 rounded-md outline-none transition
                        border-black text-black"
                                onChange={(e) => handleOrderByOnChange(e, e.target.value)}>
                            {Object.values(OrderByChoices).map((val: string) => (
                                <option key={val} value={val}>
                                    {locale[val]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <FilterNavbarList label={locale.brands} items={brands} idField="id" nameField="name"
                                      onChange={handleBrandOnChange} queryParam="brand"/>
                    <div className="border-b border-gray-300 pb-4">
                        <MinMaxValueInput onClick={handlePriceOnChange} minValue={minPrice} maxValue={maxPrice}
                                          setMinValue={setMinPrice} setMaxValue={setMaxPrice} label={locale.price}/>
                    </div>
                </div>
            </>
        )}
        </>
    );
};

export default FilterNavbar;
