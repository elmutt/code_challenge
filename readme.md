

##### Notes:

#####I see a problem with the following task:

- "Actively updating the combined order book based on actual trades from the exchanges".

Doing this task correctly would require actively matching orders as they arrive in the order book.

Without actively matching orders the books would become inaccurate due to overlapping bids and
asks within the same exchange.

Overlapping bids and ask within a single exchange would make it impossible to accurately 
"Highlight if the books overlap" because all of the order books would incorrectly overlap
as new orders came in.



I will instead demonstrate active connections to the exchanges by displaying orders in real time, 
without adding them to the order books.