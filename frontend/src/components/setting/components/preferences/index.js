const Preferences = () => {
    return <section className="border border-[rgb(var(--lb-blue-300))] rounded">
        <form>
            <div className="p-4 border-b border-[rgb(var(--lb-blue-300))]">
                <div className="mb-2">
                    <div className="text-white text-[14px] font-bold">Username</div>
                    <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">(The username and email are the only credentials for login)</div>
                </div>
            </div>
            <div className="mt-0 p-4 text-center">
                <div className="text-[rgb(var(--lb-blue-250))] text-[13px] mb-2">* You can see your hidden info, but others can&apos;t *</div>
            </div>

        </form>
    </section>;
};
export default Preferences;