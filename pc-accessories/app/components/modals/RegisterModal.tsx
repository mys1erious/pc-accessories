'use client';

import React, {useCallback, useContext, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {FcGoogle} from "react-icons/fc";
import toast from "react-hot-toast";
import {signIn} from "next-auth/react";

import axios from "axios";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/core/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/core/Button";
import {Exceptions} from "@/app/constants/constants";
import {LocaleContext} from "@/app/contexts/LocaleContext";


const RegisterModal = () => {
    // @ts-ignore
    const { locale } = useContext(LocaleContext);
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post('/api/sign-up/', data).then(() => {
            registerModal.onClose();
        }).catch((error) => {
            toast.error(Exceptions.SOMETHING_WENT_WRONG);
        }).finally(() => {
            setIsLoading(false);
        })
    };

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal]);


    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title={locale.welcome} subtitle={locale.createAccount} />
            <Input id="email" label={locale.email} disabled={isLoading}
                   register={register} errors={errors} required/>
            <Input id="name" label={locale.name} disabled={isLoading}
                   register={register} errors={errors} required/>
            <Input id="password" label={locale.password} disabled={isLoading}
                   register={register} errors={errors} required type="password"/>
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
            <Button outline label={locale.continueWithGoogle} icon={FcGoogle}
                    onClick={() => signIn('google')}/>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row justify-center items-center gap-2">
                    <div>
                        {locale.alreadyHaveAccount}
                    </div>
                    <div onClick={toggle}
                         className="text-neutral-800 cursor-pointer hover:underline">
                        {locale.signIn}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal disabled={isLoading}
               isOpen={registerModal.isOpen}
               title={locale.signUp}
               actionLabel={locale.continue_}
               onClose={registerModal.onClose}
               onSubmit={handleSubmit(onSubmit)}
               body={bodyContent}
               footer={footerContent}
        />
    );
};


export default RegisterModal;
