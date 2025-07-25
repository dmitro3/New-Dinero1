import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TwoFactor = () => {
    return <section className="border border-[rgb(var(--lb-blue-300))] rounded">
        <form>
            <div className="p-4 border-b border-[rgb(var(--lb-blue-300))]">
                <div className="mb-2">
                    <div className="text-white text-[14px] font-bold flex justify-between"><div>Google Secret Key</div> <div className="underline cursor-pointer">How to Set 2FA?</div></div>
                    <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">(Must save this key to restore 2fa once you lost it)</div>
                    <Input className="border border-[rgb(var(--lb-blue-200))] w-[55%]" disabled />
                </div>
                <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">Sweep the qr code with google authenticator</div>

                <div className="text-white text-[14px] font-bold">Two Factor Code</div>
                <Input className="border border-[rgb(var(--lb-blue-200))] w-[55%]" name="code" />
            </div>
            <div className="mt-0 p-4 flex justify-end">
                <Button className="bg-green-500 py-2  text-white rounded hover:bg-green-600">Enable 2FA</Button>
            </div>

        </form>
    </section>;
};
export default TwoFactor;