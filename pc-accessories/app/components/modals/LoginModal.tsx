'use client';

import React, {useCallback, useContext, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {FcGoogle} from "react-icons/fc";
import toast from "react-hot-toast";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

import axios from "axios";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import {Exceptions, Success} from "@/app/constants/constants";
import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/core/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/core/Button";
import {LocaleContext} from "@/app/contexts/LocaleContext";


const LoginModal = () => {
    // @ts-ignore
    const { locale } = useContext(LocaleContext);
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false);
            if (callback?.ok) {
                toast.success(Success.SIGNED_IN);
                router.refresh();
                loginModal.onClose();
            }
            if (callback?.error)
                toast.error(callback.error);
        });
    };

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title={locale.welcomeBack} subtitle={locale.loginInYourAccount} />
            <Input id="email" label={locale.email} disabled={isLoading}
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
                        {locale.dontHaveAccount}
                    </div>
                    <div onClick={toggle}
                         className="text-neutral-800 cursor-pointer hover:underline">
                        {locale.signUp}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal disabled={isLoading}
               isOpen={loginModal.isOpen}
               title={locale.signIn}
               actionLabel={locale.continue_}
               onClose={loginModal.onClose}
               onSubmit={handleSubmit(onSubmit)}
               body={bodyContent}
               footer={footerContent}
        />
    );
};


export default LoginModal;
