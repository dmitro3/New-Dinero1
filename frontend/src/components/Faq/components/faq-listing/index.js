import React from 'react';

const FaqListing = ({ faqData }) => {
  const { title, description, questions = [], list = [] } = faqData;

  return (
    <section>
      <div className="p-4 ">
        <div className="mb-2">
          <div className="text-white text-[14px] font-bold">
            The Orion starsis a FREE-TO-PLAY online platform that operates in 2
            different modes: game coins mode & Sweepstake Cash mode.
          </div>
          <div className="text-green-400 text-[14px] font-bold mt-2">
            {title}
          </div>
          {description && (
            <div className="text-[rgb(var(--lb-blue-250))] text-[14px] mt-2">
              {description}
            </div>
          )}
          {questions &&
            questions?.map(({ question, answer }, index) => (
              <div key={index}>
                <div className="text-white text-[14px] font-bold mt-2">
                  {`${index + 1}. ${question}`}
                </div>
                <div className="text-[rgb(var(--lb-blue-250))] text-[14px] mt-2">
                  {answer}
                </div>
              </div>
            ))}
          {list &&
            list?.map(({ point, subPoint = [] }, index) => (
              <div key={index}>
                {point && (
                  <div className="text-[rgb(var(--lb-blue-250))] text-[14px] mt-2">
                    {`${index + 1}. ${point}`}
                  </div>
                )}
                {subPoint && (
                  <ul className="px-4">
                    {subPoint?.map(({ option }, index) => (
                      <li
                        key={option + index}
                        className="text-[rgb(var(--lb-blue-250))] text-[14px] mt-2 list-disc"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FaqListing;
