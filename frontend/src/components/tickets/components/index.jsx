'use client';
import { noDataTickit } from '@/assets/png';
import { chevronLeft, cross, tickets } from '@/assets/svg';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import useTicket from '../hook/useTicket';
// import CustomSelect from '@/common/components/custom-select';
// import { selectOptions } from '../constant';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import CreateTicket from './create-ticket';
import { isEmpty } from '@/lib/utils';
import TicketMessage from './ticket-message';

const Tickets = () => {
  const {
    createTicket,
    handleClick,
    handleClose,
    // dataLoading,
    ticketData,
    formatDate,
    handleTicketMessage,
    isTicketMessageOpen,
    ticketId,
    t,
  } = useTicket();

  return (
    <div className="bg-[hsl(var(--main-background))] pb-5">
      <div className="font-bold text-2xl h-16 flex  justify-between items-center  my-6">
        {(createTicket || isTicketMessageOpen) && (
          <button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              isTicketMessageOpen ? handleTicketMessage(null) : handleClick();
            }}
            className="text-white  flex items-center mx-3 hover:bg-transparent"
          >
            <Image src={chevronLeft} alt="back" />
            {t('back')}
          </button>
        )}
        <div className="flex mx-6">
          <Image src={tickets} alt="tickets" />
          <h1 className="font-bold text-2xl mx-3"> {t('tickets')} </h1>
        </div>
        <Image
          src={cross}
          alt="close icon"
          onClick={handleClose}
          className="invert hover:bg-gray-500 rounded-xl mx-6"
        />
      </div>
      <div className="w-[95%] mx-auto py-5 bg-[rgb(var(--lb-blue-800))] rounded-sm">
        <div
          className={`w-[93%] mx-auto ${isTicketMessageOpen ? '' : 'border border-dotted border-white'}  flex items-center justify-center flex-col pb-3 rounded-sm`}
        >
          {!isTicketMessageOpen ? (
            createTicket ? (
              <CreateTicket handleClick={handleClick} />
            ) : (
              <>
                {isEmpty(ticketData) ? (
                  <div className="flex justify-center flex-col">
                    <Image
                      src={noDataTickit}
                      alt="no Data Ticket"
                      height={180}
                      width={180}
                    />
                    <p className="py-2 text-[rgb(var(--lb-blue-200))]">
                      {t('youDontHaveOpenTickets')}
                    </p>
                  </div>
                ) : (
                  <div className="w-[100%] px-2 py-2 mb-2">
                    <div className="flex justify-between border-b border-dotted border-white mb-2 p-3">
                      <div className="font-bold text-base text-[rgb(var(--lb-blue-200))]">
                        <p>{t('title')}</p>
                      </div>
                      <div className="font-bold text-base text-[rgb(var(--lb-blue-200))]">
                        <p>{t('status')}</p>
                      </div>
                    </div>
                    {ticketData?.map((ticket) => (
                      <div
                        key={ticket?.id}
                        className="flex justify-between items-center text-[rgb(var(--lb-blue-200))] border-b border-dotted border-white mb-2"
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => handleTicketMessage(ticket?.id)}
                        >
                          <div
                            className={`gap-2 ${ticket.status === 'closed' ? '' : 'text-green-400'}`}
                          >
                            <span> #[{ticket.id}]</span>
                            <span> {ticket.subject} </span>
                          </div>
                          <div>{formatDate(ticket.createdAt)}</div>
                        </div>
                        <div>{ticket.status}</div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  onClick={handleClick}
                  className="bg-green-400 p-5 hover:bg-green-300 cursor-pointer font-bold text-black"
                >
                  {t('createNewTicket')}
                </Button>
              </>
            )
          ) : (
            <TicketMessage ticketId={ticketId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
